import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useAuth } from '@/stores/authStore.ts'
import { PageResponse } from '@/features/api/HttpResponse.type.ts'
import { Conversation } from '@/features/chats/types/Conversation.type.ts'
import ConversationService from '@/features/chats/services/ConversationService.ts'
import { useCustomerServicePhoneContext } from '@/features/chats/context/useCustomerServicePhoneContext.ts'

// Keys para el query cache
export const conversationKeys = {
  all: ['conversations'] as const,
  byPhone: (phoneId: number | string) =>
    [...conversationKeys.all, 'phone', phoneId] as const,
  detail: (phoneId: number | string, conversationId: number | string) =>
    [...conversationKeys.byPhone(phoneId), 'detail', conversationId] as const,
}

// Tipos para los parámetros
interface ConversationsByPhoneParams {
  phoneId: number | string
  enabled?: boolean
}

/**
 * Hook para obtener conversaciones por ID de teléfono de servicio al cliente
 */
export const useConversationsByPhone = (
  params: ConversationsByPhoneParams,
  options?: Omit<UseQueryOptions<PageResponse<Conversation>>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: conversationKeys.byPhone(params.phoneId),
    queryFn: async (): Promise<PageResponse<Conversation>> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      if (!params.phoneId) {
        throw new Error('ID de teléfono no disponible')
      }
      return await ConversationService.getByCustomerPhoneService(
        params.phoneId,
        accessToken
      )
    },
    enabled: isAuthenticated() && !!params.phoneId && (params.enabled ?? true),
    staleTime: 1 * 60 * 1000, // 1 minuto (actualizamos más rápido las conversaciones)
    refetchInterval: 15 * 1000, // Refresca cada 15 segundos para conversaciones nuevas
    retry: (failureCount, error: any) => {
      // No reintentar si es error de autorización
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false
      }
      return failureCount < 3
    },
    ...options,
  })
}

/**
 * Hook principal que usa el contexto de CustomerServicePhone
 */
export default function useConversation() {
  const { currentPhone } = useCustomerServicePhoneContext()

  const query = useConversationsByPhone({
    phoneId: currentPhone?.id || 0,
    enabled: !!currentPhone?.id,
  })

  return {
    // Datos
    conversations: query.data?.content || [],
    totalElements: query.data?.totalElements || 0,
    totalPages: query.data?.totalPages || 0,

    // Estados
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,

    // Métodos
    refetch: query.refetch,

    // Query completa
    query,
  }
}

/**
 * Hook alternativo que permite especificar el phoneId manualmente
 */
export function useConversationWithPhoneId(phoneId: number | string | undefined) {
  const query = useConversationsByPhone({
    phoneId: phoneId || 0,
    enabled: !!phoneId,
  })

  return {
    conversations: query.data?.content || [],
    totalElements: query.data?.totalElements || 0,
    totalPages: query.data?.totalPages || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,
    refetch: query.refetch,
    query,
  }
}
