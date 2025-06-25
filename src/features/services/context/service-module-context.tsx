import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Service } from '../Service.type'

type ServicesDialogType = 'create' | 'update' | 'delete'

interface ServiceContextType {
  open: ServicesDialogType | null
  setOpen: (str: ServicesDialogType | null) => void
  currentService: Service | null
  setCurrentService: React.Dispatch<React.SetStateAction<Service | null>>
}

const ServiceModuleContext = React.createContext<ServiceContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ServiceProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ServicesDialogType>(null)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  return (
    <ServiceModuleContext value={{ open, setOpen, currentService, setCurrentService }}>
      {children}
    </ServiceModuleContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useServiceModule = () => {
  const serviceModuleContext = React.useContext(ServiceModuleContext)

  if (!serviceModuleContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return serviceModuleContext
}
