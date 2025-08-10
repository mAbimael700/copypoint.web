import { create } from 'zustand'
import { Conversation } from '@/features/chats/types/Conversation.type'

type ConversationDialogType = 'create' | 'update' | 'delete' | 'view'

interface ConversationStore {
  // Estados
  open: ConversationDialogType | null
  currentConversation: Conversation | null

  // Acciones
  setOpen: (dialogType: ConversationDialogType | null) => void
  setCurrentConversation: (conversation: Conversation | null) => void

  // Acciones adicionales para mayor funcionalidad
  openDialog: (dialogType: ConversationDialogType, conversation?: Conversation) => void
  closeDialog: () => void
  reset: () => void
}

export const useConversationStore = create<ConversationStore>((set) => ({
  // Estado inicial
  open: null,
  currentConversation: null,

  // Acciones básicas
  setOpen: (dialogType) => set({ open: dialogType }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

  // Acciones compuestas para mayor comodidad
  openDialog: (dialogType, conversation) => set({
    open: dialogType,
    currentConversation: conversation || null
  }),
  closeDialog: () => set({
    open: null
  }),
  reset: () => set({
    open: null,
    currentConversation: null,
  })
}))

// Hook personalizado que mantiene la misma API que los otros contextos
export const useConversationContext = () => {
  const store = useConversationStore()

  return {
    open: store.open,
    setOpen: store.setOpen,
    currentConversation: store.currentConversation,
    setCurrentConversation: store.setCurrentConversation,

    // Métodos adicionales disponibles
    openDialog: store.openDialog,
    closeDialog: store.closeDialog,
    reset: store.reset
  }
}
