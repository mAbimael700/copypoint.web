import ApiHttpClient from '@/config/ApiHttpClient.ts';
import {
  AttachmentAvailabilityResponse,
  AttachmentResponse,
  PresignedUrlResponse,
} from '@/features/chats/types/Attachment.type.ts'


// Tipos/interfaces basados en tu controller Java
class AttachmentService {
  private static instance: AttachmentService

  private constructor() {}

  public static getInstance(): AttachmentService {
    if (!AttachmentService.instance) {
      AttachmentService.instance = new AttachmentService()
    }
    return AttachmentService.instance
  }

  /**
   * Descargar un archivo attachment por su ID
   * Retorna el archivo como blob para visualización/descarga
   */
  async downloadAttachment(
    attachmentId: number | string,
    accessToken: string
  ): Promise<Blob> {
    const response = await ApiHttpClient.get<Blob>(
      `/attachments/${attachmentId}/download`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'blob'
      }
    )
    return response.data
  }

  /**
   * Obtener información del attachment (metadata)
   */
  async getAttachmentInfo(
    attachmentId: number | string,
    accessToken: string
  ): Promise<AttachmentResponse> {
    const response = await ApiHttpClient.get<AttachmentResponse>(
      `/attachments/${attachmentId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  /**
   * Generar URL prefirmada para acceso directo
   */
  async generatePresignedUrl(
    attachmentId: number | string,
    accessToken: string,
    expirationMinutes: number = 60
  ): Promise<PresignedUrlResponse> {
    const response = await ApiHttpClient.get<PresignedUrlResponse>(
      `/attachments/${attachmentId}/presigned-url`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { expirationMinutes }
      }
    )
    return response.data
  }

  /**
   * Verificar si un attachment está disponible
   */
  async checkAvailability(
    attachmentId: number | string,
    accessToken: string
  ): Promise<AttachmentAvailabilityResponse> {
    const response = await ApiHttpClient.get<AttachmentAvailabilityResponse>(
      `/attachments/${attachmentId}/available`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  /**
   * Método utilitario para descargar y crear un enlace de descarga
   * Útil para triggers de descarga en el frontend
   */
  async downloadAndCreateBlobUrl(
    attachmentId: number | string,
    accessToken: string,
    fileName?: string
  ): Promise<string> {
    const blob = await this.downloadAttachment(attachmentId, accessToken)
    const url = URL.createObjectURL(blob)

    // Si se proporciona fileName, crear un enlace temporal para descarga
    if (fileName) {
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return url
  }

  /**
   * Método para limpiar URLs blob creadas
   */
  static revokeBlobUrl(url: string): void {
    URL.revokeObjectURL(url)
  }

  revokeBlobUrl(blobUrl: string) {
    URL.revokeObjectURL(blobUrl)
  }
}

export default AttachmentService.getInstance()