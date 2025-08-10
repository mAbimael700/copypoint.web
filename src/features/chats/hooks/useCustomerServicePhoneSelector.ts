import { useState, useEffect } from 'react'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import { useCustomerServicePhoneContext } from '@/features/chats/context/useCustomerServicePhoneContext'
import useCustomerServicePhone from '@/features/chats/hooks/useCustomerServicePhone'
import type { CopypointResponse } from '@/features/copypoints/Copypoint.type'
import type { CustomerServicePhone } from '@/features/chats/types/CustomerServicePhone.type'

/**
 * Hook para manejar la selección de un teléfono de servicio al cliente basado en un copypoint
 */
export function useCustomerServicePhoneSelector() {
  // Acceder a los contextos
  const { currentCopypoint, setCurrentCopypoint } = useCopypointContext()
  const { currentPhone, setCurrentPhone } = useCustomerServicePhoneContext()

  // Estado local
  const [isSelectingCopypoint, setIsSelectingCopypoint] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Obtener los teléfonos para el copypoint actual
  const {
    customerServicePhones,
    totalPhones,
    isLoading,
    isError,
    isSuccess,
    refetch,
    createPhone,
    isCreating
  } = useCustomerServicePhone()

  // Actualizar el teléfono actual cuando cambie el resultado de la consulta
  useEffect(() => {
    if (isSuccess && customerServicePhones.length > 0 && !currentPhone) {
      setCurrentPhone(customerServicePhones[0])
    }
  }, [customerServicePhones, isSuccess, currentPhone, setCurrentPhone])

  // Filtrar teléfonos por término de búsqueda
  const filteredPhones = searchTerm.trim() === ''
    ? customerServicePhones
    : customerServicePhones.filter(phone => 
        phone.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))

  // Manejar la selección de un copypoint
  const handleCopypointSelect = (copypoint: CopypointResponse) => {
    setCurrentCopypoint(copypoint)
    setCurrentPhone(null) // Resetear el teléfono actual
    setIsSelectingCopypoint(false)
  }

  // Manejar la selección de un teléfono
  const handlePhoneSelect = (phone: CustomerServicePhone) => {
    setCurrentPhone(phone)
  }

  // Función para abrir el selector de copypoint
  const openCopypointSelector = () => {
    setIsSelectingCopypoint(true)
  }

  // Formatear el número de teléfono para mostrar
  const formatPhoneNumber = (phoneNumber?: string) => {
    if (!phoneNumber) return ''

    // Intenta formatear como número telefónico
    try {
      return phoneNumber.replace(/\D+/g, '')
        .replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')
    } catch (e) {
      return phoneNumber
    }
  }

  return {
    // Datos
    currentCopypoint,
    currentPhone,
    customerServicePhones,
    filteredPhones,
    totalPhones,
    formattedPhoneNumber: formatPhoneNumber(currentPhone?.phoneNumber || 
      (customerServicePhones[0]?.phoneNumber || '')),

    // Estados
    isLoading,
    isError,
    isSuccess,
    isCreating,
    isSelectingCopypoint,
    hasCopypoint: !!currentCopypoint,
    hasPhones: customerServicePhones.length > 0,
    hasSelectedPhone: !!currentPhone,
    searchTerm,

    // Acciones
    setCurrentCopypoint,
    setCurrentPhone,
    handleCopypointSelect,
    handlePhoneSelect,
    openCopypointSelector,
    setIsSelectingCopypoint,
    setSearchTerm,
    refetch,
    createPhone,
    formatPhoneNumber
  }
}
