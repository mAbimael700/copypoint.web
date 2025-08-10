import { create } from 'zustand'
import { Message } from '@/features/chats/types/Message.type'

type MessageDialogType = 'create' | 'update' | 'delete' | 'view'

interface MessageStore {
  // Estados
  open: MessageDialogType | null
  currentMessage: Message | null

  // Acciones
  setOpen: (dialogType: MessageDialogType | null) => void
  setCurrentMessage: (message: Message | null) => void

  // Acciones adicionales para mayor funcionalidad
  openDialog: (dialogType: MessageDialogType, message?: Message) => void
  closeDialog: () => void
  reset: () => void
}

export const useMessageStore = create<MessageStore>((set) => ({
  // Estado inicial
  open: null,
  currentMessage: null,

  // Acciones básicas
  setOpen: (dialogType) => set({ open: dialogType }),
  setCurrentMessage: (message) => set({ currentMessage: message }),

  // Acciones compuestas para mayor comodidad
  openDialog: (dialogType, message) => set({
    open: dialogType,
    currentMessage: message || null
  }),
  closeDialog: () => set({
    open: null
  }),
  reset: () => set({
    open: null,
    currentMessage: null,
  })
}))

// Hook personalizado que mantiene la misma API que los otros contextos
export const useMessageContext = () => {
  const store = useMessageStore()

  return {
    open: store.open,
    setOpen: store.setOpen,
    currentMessage: store.currentMessage,
    setCurrentMessage: store.setCurrentMessage,

    // Métodos adicionales disponibles
    openDialog: store.openDialog,
    closeDialog: store.closeDialog,
    reset: store.reset
  }
}
