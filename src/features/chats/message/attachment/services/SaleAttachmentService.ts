import ApiHttpClient from '@/config/ApiHttpClient'
import { AttachmentResponse } from '@/features/chats/types/Attachment.type'

// Tipos basados en los DTOs Java
export interface SaleAttachmentDTO {
  profileId: number
  serviceId: number
  copies: number
  useCalculatedQuantity?: boolean
}

export interface SaleProfileDTO {
  saleId: number
  profileId: number
  service: SaleProfileServiceDTO
  name: string
  description: string
  unitPrice: number
  quantity: number
  subtotal: number
  attachment: AttachmentResponse
}

export interface SaleProfileServiceDTO {
  id: number
  name: string
  // Agregar otros campos del servicio según sea necesario
}

class SaleAttachmentService {
  private static instance: SaleAttachmentService

  private constructor() {}

  public static getInstance(): SaleAttachmentService {
    if (!SaleAttachmentService.instance) {
      SaleAttachmentService.instance = new SaleAttachmentService()
    }
    return SaleAttachmentService.instance
  }

  /**
   * Agregar attachment a una venta
   */
  async addAttachmentToSale(
    saleId: number,
    attachmentId: number,
    attachmentData: SaleAttachmentDTO,
    accessToken: string
  ): Promise<SaleProfileDTO> {
    const response = await ApiHttpClient.post<SaleProfileDTO>(
      `/sales/${saleId}/attachment/${attachmentId}`,
      attachmentData,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  /**
   * Remover attachment de un item de venta
   */
  async removeAttachmentFromSaleProfile(
    saleId: number,
    profileId: number,
    serviceId: number,
    accessToken: string
  ): Promise<SaleProfileDTO> {
    const response = await ApiHttpClient.delete<SaleProfileDTO>(
      `/sales/${saleId}/attachment/profile/${profileId}/service/${serviceId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  /**
   * Obtener attachment de un item de venta
   */
  async getAttachmentFromSaleProfile(
    saleId: number,
    profileId: number,
    serviceId: number,
    accessToken: string
  ): Promise<AttachmentResponse | null> {
    try {
      const response = await ApiHttpClient.get<AttachmentResponse>(
        `/sales/${saleId}/attachment/profile/${profileId}/service/${serviceId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Forzar cálculo de páginas de un attachment (cuando esté implementado)
   */
  async calculateAttachmentPages(
    saleId: number,
    attachmentId: number,
    accessToken: string
  ): Promise<number> {
    const response = await ApiHttpClient.post<number>(
      `/sales/${saleId}/attachment/${attachmentId}/calculate-pages`,
      {}, { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  /**
   * Obtener todos los attachments asociados a una venta
   */
  async getAllAttachmentsFromSale(
    saleId: number,
    accessToken: string
  ): Promise<AttachmentResponse[]> {
    const response = await ApiHttpClient.get<AttachmentResponse[]>(
      `/sales/${saleId}/attachments`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }
}

export default SaleAttachmentService.getInstance()
