import { create } from 'zustand'
import { CustomerServicePhone } from '@/features/chats/types/CustomerServicePhone.type'

type CustomerServicePhoneDialogType = 'create' | 'update' | 'delete'

interface CustomerServicePhoneStore {
  // Estados
  open: CustomerServicePhoneDialogType | null
  currentPhone: CustomerServicePhone | null

  // Acciones
  setOpen: (dialogType: CustomerServicePhoneDialogType | null) => void
  setCurrentPhone: (phone: CustomerServicePhone | null) => void

  // Acciones adicionales para mayor funcionalidad
  openDialog: (dialogType: CustomerServicePhoneDialogType, phone?: CustomerServicePhone) => void
  closeDialog: () => void
  reset: () => void
}

export const useCustomerServicePhoneStore = create<CustomerServicePhoneStore>((set) => ({
  // Estado inicial
  open: null,
  currentPhone: null,

  // Acciones básicas
  setOpen: (dialogType) => set({ open: dialogType }),
  setCurrentPhone: (phone) => set({ currentPhone: phone }),

  // Acciones compuestas para mayor comodidad
  openDialog: (dialogType, phone) => set({
    open: dialogType,
    currentPhone: phone || null
  }),
  closeDialog: () => set({
    open: null
  }),
  reset: () => set({
    open: null,
    currentPhone: null,
  })
}))

// Hook personalizado que mantiene la misma API que los otros contextos
export const useCustomerServicePhoneContext = () => {
  const store = useCustomerServicePhoneStore()

  return {
    open: store.open,
    setOpen: store.setOpen,
    currentPhone: store.currentPhone,
    setCurrentPhone: store.setCurrentPhone,

    // Métodos adicionales disponibles
    openDialog: store.openDialog,
    closeDialog: store.closeDialog,
    reset: store.reset
  }
}
