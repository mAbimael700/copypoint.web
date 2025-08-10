import { useCustomerServicePhoneContext } from '@/features/chats/context/useCustomerServicePhoneContext.ts';
import useCustomerServicePhone, { useCustomerServicePhoneWithId } from '@/features/chats/hooks/useCustomerServicePhone.ts';
import { CustomerServicePhoneCreationDTO } from '@/features/chats/types/CustomerServicePhone.type.ts';


/**
 * Hook combinado que integra el contexto con las operaciones de CustomerServicePhone
 */
export function useCustomerServicePhoneOperations() {
  // Acceder al contexto
  const { currentPhone, setCurrentPhone, openDialog, closeDialog, reset } =
    useCustomerServicePhoneContext()

  // Usar el hook base que ya usa el contexto
  const {
    customerServicePhone,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    createPhone,
    isCreating,
    createError,
  } = useCustomerServicePhone()

  // Función que combina la creación con la actualización del contexto
  const createAndSelectPhone = async (
    data: CustomerServicePhoneCreationDTO
  ) => {
    const newPhone = await createPhone(data)
    setCurrentPhone(newPhone)
    return newPhone
  }

  return {
    // Estado del contexto
    currentPhone,

    // Datos del phone actual
    customerServicePhone,

    // Estados
    isLoading,
    isError,
    isSuccess,
    isCreating,

    // Errores
    error,
    createError,

    // Acciones del contexto
    setCurrentPhone,
    openDialog,
    closeDialog,
    reset,

    // Acciones combinadas
    createAndSelectPhone,
    createPhone,
    refetch,
  }
}

/**
 * Hook alternativo que permite especificar el phoneId manualmente
 */
export function useCustomerServicePhoneOperationsWithId(
  phoneId: number | string | undefined
) {
  const { setCurrentPhone } = useCustomerServicePhoneContext()

  const {
    customerServicePhone,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    createPhone,
    isCreating,
    createError,
  } = useCustomerServicePhoneWithId(phoneId)

  // Función para seleccionar el teléfono en el contexto global
  const selectPhone = () => {
    if (customerServicePhone) {
      setCurrentPhone(customerServicePhone)
      return true
    }
    return false
  }

  return {
    customerServicePhone,
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    createPhone,
    isCreating,
    createError,

    // Métodos adicionales
    selectPhone,
  }
}
