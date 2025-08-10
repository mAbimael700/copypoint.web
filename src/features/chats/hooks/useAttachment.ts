import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useAuth } from '@/stores/authStore.ts'
import AttachmentService from '@/features/chats/message/services/AttachmentService.ts'
import { AttachmentAvailabilityResponse, AttachmentResponse } from '@/features/chats/types/Attachment.type.ts'

// Keys para el query cache
export const attachmentKeys = {
  all: ['attachments'] as const,
  details: (id: number | string) => [...attachmentKeys.all, 'detail', id.toString()] as const,
  availability: (id: number | string) => [...attachmentKeys.all, 'availability', id.toString()] as const,
  download: (id: number | string) => [...attachmentKeys.all, 'download', id.toString()] as const,
  presignedUrl: (id: number | string) => [...attachmentKeys.all, 'presignedUrl', id.toString()] as const,
}

// Hook para obtener información de un attachment
export const useAttachmentInfo = (
  attachmentId: number | string | undefined,
  options?: Omit<UseQueryOptions<AttachmentResponse>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: attachmentKeys.details(attachmentId || 0),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      if (!attachmentId) {
        throw new Error('ID de attachment no especificado')
      }
      return await AttachmentService.getAttachmentInfo(attachmentId, accessToken)
    },
    enabled: isAuthenticated() && !!attachmentId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  })
}

// Hook para verificar la disponibilidad de un attachment
export const useAttachmentAvailability = (
  attachmentId: number | string | undefined,
  options?: Omit<UseQueryOptions<AttachmentAvailabilityResponse>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: attachmentKeys.availability(attachmentId || 0),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      if (!attachmentId) {
        throw new Error('ID de attachment no especificado')
      }
      return await AttachmentService.checkAvailability(attachmentId, accessToken)
    },
    enabled: isAuthenticated() && !!attachmentId,
    // Verificar cada 10 segundos hasta que esté disponible
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    gcTime: 5 * 60 * 1000, // 5 minutos
    staleTime: 60 * 1000, // 1 minuto
    ...options,
  })
}

// Hook para descargar un attachment como blob
export const useAttachmentDownload = (attachmentId: number | string | undefined) => {
  const { accessToken, isAuthenticated } = useAuth()
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  // Limpiar la URL del blob cuando se desmonte el componente
  useEffect(() => {
    return () => {
      if (blobUrl) {
        AttachmentService.revokeBlobUrl(blobUrl)
      }
    }
  }, [blobUrl])

  // Función para descargar el attachment
  const downloadAttachment = async (fileName?: string): Promise<string | null> => {
    if (!accessToken || !isAuthenticated() || !attachmentId) {
      return null
    }

    try {
      setIsDownloading(true)
      setError(null)

      // Limpiar la URL anterior si existe
      if (blobUrl) {
        AttachmentService.revokeBlobUrl(blobUrl)
      }

      const url = await AttachmentService.downloadAndCreateBlobUrl(
        attachmentId,
        accessToken,
        fileName
      )

      setBlobUrl(url)
      return url
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err.message || 'Error al descargar'))
      return null
    } finally {
      setIsDownloading(false)
    }
  }

  // Función para iniciar la descarga con nombre de archivo
  const downloadAndSave = async (fileName?: string): Promise<void> => {
    await downloadAttachment(fileName || 'download')
  }

  // Función para obtener el blob para previsualización
  const getPreviewUrl = async (): Promise<string | null> => {
    return downloadAttachment()
  }

  return {
    downloadAndSave,
    getPreviewUrl,
    isDownloading,
    error,
    blobUrl,
    reset: () => {
      if (blobUrl) {
        AttachmentService.revokeBlobUrl(blobUrl)
      }
      setBlobUrl(null)
      setError(null)
    },
  }
}

// Hook para obtener URL prefirmada
export const usePresignedUrl = (
  attachmentId: number | string | undefined,
  expirationMinutes: number = 60,
  options?: Omit<UseQueryOptions<string>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [...attachmentKeys.presignedUrl(attachmentId || 0), expirationMinutes],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      if (!attachmentId) {
        throw new Error('ID de attachment no especificado')
      }
      const response = await AttachmentService.generatePresignedUrl(
        attachmentId,
        accessToken,
        expirationMinutes
      )
      return response.presignedUrl
    },
    enabled: isAuthenticated() && !!attachmentId,
    staleTime: (expirationMinutes * 60 * 1000) / 2, // La mitad del tiempo de expiración
    ...options,
  })
}

// Hook principal para gestionar un attachment
export const useAttachment = (attachmentId: number | string | undefined) => {
  const info = useAttachmentInfo(attachmentId)
  const availability = useAttachmentAvailability(attachmentId)
  const download = useAttachmentDownload(attachmentId)

  const isAvailable = availability.data?.isAvailable ?? false
  const attachmentInfo = info.data

  // Formatear el tamaño del archivo
  const formatFileSize = (bytes?: number): string => {
    if (bytes === undefined) return ''
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Obtener el tipo de archivo
  const getFileType = (): 'image' | 'video' | 'audio' | 'document' | 'other' => {
    const mimeType = attachmentInfo?.mimeType || ''

    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('word') ||
      mimeType.includes('excel') ||
      mimeType.includes('powerpoint') ||
      mimeType.includes('text/')
    ) return 'document'

    return 'other'
  }

  return {
    // Datos
    attachmentInfo,
    fileName: attachmentInfo?.originalName || '',
    fileSize: formatFileSize(attachmentInfo?.fileSizeBytes),
    mimeType: attachmentInfo?.mimeType || '',
    fileType: getFileType(),
    isAvailable,

    // Estados
    isLoadingInfo: info.isLoading,
    isCheckingAvailability: availability.isLoading,
    isDownloading: download.isDownloading,
    isError: info.isError || availability.isError,
    error: info.error || availability.error || download.error,

    // Acciones de descarga
    downloadAndSave: download.downloadAndSave,
    getPreviewUrl: download.getPreviewUrl,
    blobUrl: download.blobUrl,
    resetDownload: download.reset,

    // Consultas originales
    infoQuery: info,
    availabilityQuery: availability,
  }
}
