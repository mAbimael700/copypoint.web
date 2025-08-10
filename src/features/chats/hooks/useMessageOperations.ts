import { useMessageContext } from '@/features/chats/context/useMessageContext.ts'
import useMessage, { useMessageWithConversationId } from '@/features/chats/hooks/useMessage.ts'
import { useConversationContext } from '@/features/chats/context/useConversationContext.ts'
import { Message } from '@/features/chats/types/Message.type.ts'

/**
 * Hook combinado que integra el contexto con las operaciones de Message
 */
export function useMessageOperations() {
  // Acceder al contexto
  const { 
    currentMessage, 
    setCurrentMessage,
    openDialog,
    closeDialog,
    reset 
  } = useMessageContext()

  // Acceder al contexto de conversación
  const { currentConversation } = useConversationContext()

  // Usar el hook base que ya usa el contexto
  const {
    messages,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    totalElements,
    totalPages
  } = useMessage()

  // Función para seleccionar un mensaje y abrir el diálogo de visualización
  const viewMessage = (message: Message) => {
    setCurrentMessage(message)
    openDialog('view', message)
  }

  return {
    // Estado del contexto
    currentMessage,
    currentConversation,

    // Datos
    messages,
    totalElements,
    totalPages,

    // Estados
    isLoading,
    isError,
    isSuccess,

    // Errores
    error,

    // Acciones del contexto
    setCurrentMessage,
    openDialog,
    closeDialog,
    reset,

    // Acciones combinadas
    viewMessage,
    refetch
  }
}

/**
 * Hook alternativo que permite especificar el conversationId manualmente
 */
export function useMessageOperationsWithConversationId(conversationId: number | string | undefined) {
  const { setCurrentMessage, openDialog } = useMessageContext()

  const {
    messages,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    totalElements,
    totalPages
  } = useMessageWithConversationId(conversationId)

  // Función para seleccionar un mensaje
  const selectMessage = (message: Message) => {
    setCurrentMessage(message)
    return message
  }

  // Función para ver un mensaje
  const viewMessage = (message: Message) => {
    setCurrentMessage(message)
    openDialog('view', message)
  }

  return {
    messages,
    totalElements,
    totalPages,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,

    // Métodos adicionales
    selectMessage,
    viewMessage
  }
}
