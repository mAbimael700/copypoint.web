import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useAuth } from '@/stores/authStore.ts'
import { PageResponse } from '@/features/api/HttpResponse.type.ts'
import { Message } from '@/features/chats/types/Message.type.ts'
import MessageService from '@/features/chats/services/MessageService.ts'
import { useConversationContext } from '@/features/chats/context/useConversationContext.ts'

// Keys para el query cache
export const messageKeys = {
  all: ['messages'] as const,
  byConversation: (conversationId: number | string) =>
    [...messageKeys.all, 'conversation', conversationId] as const,
  detail: (conversationId: number | string, messageId: number | string) =>
    [...messageKeys.byConversation(conversationId), 'detail', messageId] as const,
}

// Tipos para los parámetros
interface MessagesByConversationParams {
  conversationId: number | string
  enabled?: boolean
}

/**
 * Hook para obtener mensajes por ID de conversación
 */
export const useMessagesByConversation = (
  params: MessagesByConversationParams,
  options?: Omit<UseQueryOptions<PageResponse<Message>>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: messageKeys.byConversation(params.conversationId),
    queryFn: async (): Promise<PageResponse<Message>> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      if (!params.conversationId) {
        throw new Error('ID de conversación no disponible')
      }
      return await MessageService.getByConversation(
        params.conversationId,
        accessToken
      ) as unknown as PageResponse<Message>
    },
    enabled: isAuthenticated() && !!params.conversationId && (params.enabled ?? true),
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 10 * 1000, // Refresca cada 10 segundos para mensajes nuevos
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
 * Hook principal que usa el contexto de Conversation
 */
export default function useMessage() {
  const { currentConversation } = useConversationContext()

  const query = useMessagesByConversation({
    conversationId: currentConversation?.id || 0,
    enabled: !!currentConversation?.id,
  })

  return {
    // Datos
    messages: query.data?.content || [],
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
 * Hook alternativo que permite especificar el conversationId manualmente
 */
export function useMessageWithConversationId(conversationId: number | string | undefined) {
  const query = useMessagesByConversation({
    conversationId: conversationId || 0,
    enabled: !!conversationId,
  })

  return {
    messages: query.data?.content || [],
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
