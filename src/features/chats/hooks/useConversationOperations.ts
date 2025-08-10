import { useConversationContext } from '@/features/chats/context/useConversationContext.ts'
import useConversation, { useConversationWithPhoneId } from '@/features/chats/hooks/useConversation.ts'
import { useCustomerServicePhoneContext } from '@/features/chats/context/useCustomerServicePhoneContext.ts'
import { Conversation } from '@/features/chats/types/Conversation.type.ts'

/**
 * Hook combinado que integra el contexto con las operaciones de Conversation
 */
export function useConversationOperations() {
  // Acceder al contexto
  const { 
    currentConversation, 
    setCurrentConversation,
    openDialog,
    closeDialog,
    reset 
  } = useConversationContext()

  // Acceder al contexto del teléfono
  const { currentPhone } = useCustomerServicePhoneContext()

  // Usar el hook base que ya usa el contexto
  const {
    conversations,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    totalElements,
    totalPages
  } = useConversation()

  // Función para seleccionar una conversación y abrir el diálogo de visualización
  const viewConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation)
    openDialog('view', conversation)
  }

  return {
    // Estado del contexto
    currentConversation,
    currentPhone,

    // Datos
    conversations,
    totalElements,
    totalPages,

    // Estados
    isLoading,
    isError,
    isSuccess,

    // Errores
    error,

    // Acciones del contexto
    setCurrentConversation,
    openDialog,
    closeDialog,
    reset,

    // Acciones combinadas
    viewConversation,
    refetch
  }
}

/**
 * Hook alternativo que permite especificar el phoneId manualmente
 */
export function useConversationOperationsWithPhoneId(phoneId: number | string | undefined) {
  const { setCurrentConversation, openDialog } = useConversationContext()

  const {
    conversations,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    totalElements,
    totalPages
  } = useConversationWithPhoneId(phoneId)

  // Función para seleccionar una conversación
  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation)
    return conversation
  }

  // Función para ver una conversación
  const viewConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation)
    openDialog('view', conversation)
  }

  return {
    conversations,
    totalElements,
    totalPages,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,

    // Métodos adicionales
    selectConversation,
    viewConversation
  }
}
