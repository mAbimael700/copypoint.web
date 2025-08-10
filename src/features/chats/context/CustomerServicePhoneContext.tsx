import React, { createContext, useContext, useState, ReactNode } from 'react'
import { CustomerServicePhone } from '@/features/chats/types/CustomerServicePhone.type'

interface CustomerServicePhoneContextType {
  // Estado
  currentPhone: CustomerServicePhone | null
  open: boolean

  // Acciones
  setCurrentPhone: (phone: CustomerServicePhone | null) => void
  setOpen: (open: boolean) => void
  openDialog: () => void
  closeDialog: () => void
  reset: () => void
}

const CustomerServicePhoneContext = createContext<CustomerServicePhoneContextType | undefined>(undefined)

export const CustomerServicePhoneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPhone, setCurrentPhone] = useState<CustomerServicePhone | null>(null)
  const [open, setOpen] = useState(false)

  const openDialog = () => setOpen(true)
  const closeDialog = () => setOpen(false)
  const reset = () => {
    setCurrentPhone(null)
    setOpen(false)
  }

  return (
    <CustomerServicePhoneContext.Provider value={{
      currentPhone,
      setCurrentPhone,
      open,
      setOpen,
      openDialog,
      closeDialog,
      reset
    }}>
      {children}
    </CustomerServicePhoneContext.Provider>
  )
}

export const useCustomerServicePhoneContext = () => {
  const context = useContext(CustomerServicePhoneContext)
  if (context === undefined) {
    throw new Error('useCustomerServicePhoneContext must be used within a CustomerServicePhoneProvider')
  }
  return context
}
