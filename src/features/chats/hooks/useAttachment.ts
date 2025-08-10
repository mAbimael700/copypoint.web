import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useAuth } from '@/stores/authStore.ts'
import AttachmentService from '@/features/chats/message/services/AttachmentService.ts'
import {
  AttachmentAvailabilityResponse,
  AttachmentResponse,
} from '@/features/chats/types/Attachment.type.ts'

// Keys para el query cache
export const attachmentKeys = {
  all: ['attachments'] as const,
  details: (id: number | string) =>
    [...attachmentKeys.all, 'detail', id.toString()] as const,
  availability: (id: number | string) =>
    [...attachmentKeys.all, 'availability', id.toString()] as const,
  download: (id: number | string) =>
    [...attachmentKeys.all, 'download', id.toString()] as const,
  presignedUrl: (id: number | string) =>
    [...attachmentKeys.all, 'presignedUrl', id.toString()] as const,
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
      return await AttachmentService.getAttachmentInfo(
        attachmentId,
        accessToken
      )
    },
    enabled: isAuthenticated() && !!attachmentId,
    staleTime: Infinity, // Nunca considerar los datos obsoletos
    gcTime: 30 * 60 * 1000, // 30 minutos en caché
    retry: false, // No reintentar automáticamente
    refetchOnMount: true, // Consultar solo al montar
    refetchOnWindowFocus: false, // No consultar al volver a la ventana
    refetchOnReconnect: false, // No consultar al reconectar
    ...options,
  })
}

// Hook para verificar la disponibilidad de un attachment
export const useAttachmentAvailability = (
  attachmentId: number | string | undefined,
  options?: Omit<
    UseQueryOptions<AttachmentAvailabilityResponse>,
    'queryKey' | 'queryFn'
  >
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
      return await AttachmentService.checkAvailability(
        attachmentId,
        accessToken
      )
    },
    enabled: isAuthenticated() && !!attachmentId,
    // Versión simplificada: solo consultar una vez
    staleTime: Infinity, // Nunca considerar los datos obsoletos
    gcTime: 30 * 60 * 1000, // 30 minutos en caché
    retry: false, // No reintentar automáticamente
    refetchOnMount: true, // Consultar solo al montar
    refetchOnWindowFocus: false, // No consultar al volver a la ventana
    refetchOnReconnect: false, // No consultar al reconectar
    ...options,
  })
}

// Eliminamos este hook y lo reemplazamos por llamadas directas al servicio
// en los componentes que lo necesiten para evitar re-renderizados innecesarios

// Hook para obtener URL prefirmada
export const usePresignedUrl = (
  attachmentId: number | string | undefined,
  expirationMinutes: number = 60,
  options?: Omit<UseQueryOptions<string>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      ...attachmentKeys.presignedUrl(attachmentId || 0),
      expirationMinutes,
    ],
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

// Hook principal para gestionar un attachment - versión simplificada
export const useAttachment = (attachmentId: number | string | undefined) => {
  // Solo usamos las consultas básicas, evitamos las funciones que causan re-renderizados
  const info = useAttachmentInfo(attachmentId)
  const availability = useAttachmentAvailability(attachmentId)

  const isAvailable = availability.data?.isAvailable ?? false
  const attachmentInfo = info.data

  // Obtener el tipo de archivo
  const getFileType = ():
    | 'image'
    | 'video'
    | 'audio'
    | 'document'
    | 'other' => {
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
    )
      return 'document'

    return 'other'
  }

  // Calculamos solo lo esencial, sin memorizaciones complejas
  const fileType = getFileType()

  return {
    // Solo exponemos los datos más básicos
    attachmentId,
    attachmentInfo,
    fileType,
    isAvailable,
    isLoadingInfo: info.isLoading,
    isCheckingAvailability: availability.isLoading,

    // Las funciones de descarga ahora se manejan directamente en los componentes
  }
}
