import React, { useCallback, useEffect } from 'react'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useCustomerServicePhoneContext } from '@/features/chats/context/useCustomerServicePhoneContext'
import useCustomerServicePhone from '@/features/chats/hooks/useCustomerServicePhone'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import { CustomerServicePhone } from '../types/CustomerServicePhone.type'

interface PhoneSelectorProps {
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  onPhoneSelect?: (phone: CustomerServicePhone) => void
  defaultToFirst?: boolean
}

const PhoneSelector: React.FC<PhoneSelectorProps> = ({
  label = 'Teléfono',
  onPhoneSelect,
  defaultToFirst = true,
}) => {
  // Contextos
  const { currentCopypoint } = useCopypointContext()
  const { currentPhone, setCurrentPhone } = useCustomerServicePhoneContext()

  // Estados
  const [searchValue, setSearchValue] = React.useState('')

  // Consulta de teléfonos para el copypoint actual
  const { customerServicePhones, isLoading, isSuccess } =
    useCustomerServicePhone()

  // Formatear el número de teléfono para mostrar
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return ''

    try {
      return phone
        .replace(/\D+/g, '')
        .replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')
    } catch (e) {
      return phone
    }
  }

  // Filtrar teléfonos por búsqueda
  const filteredPhones =
    searchValue.trim() === ''
      ? customerServicePhones
      : customerServicePhones.filter((phone) =>
          phone.phoneNumber.toLowerCase().includes(searchValue.toLowerCase())
        )

  // Manejar la selección de un teléfono
  const handlePhoneSelection = useCallback(
    (phone: CustomerServicePhone) => {
      if (onPhoneSelect) {
        onPhoneSelect(phone)
      } else {
        setCurrentPhone(phone)
      }
    },
    [onPhoneSelect, setCurrentPhone]
  )

  const handleSelectPhone = (phoneId: string) => {
    const selectedPhone = customerServicePhones.find(
      (phone) => phone.id.toString() === phoneId
    )
    if (selectedPhone) {
      handlePhoneSelection(selectedPhone)
    }
  }

  // Establecer el primer teléfono como seleccionado cuando se cargan los teléfonos
  useEffect(() => {
    if (
      defaultToFirst &&
      isSuccess &&
      customerServicePhones.length > 0 &&
      !currentPhone
    ) {
      handlePhoneSelection(customerServicePhones[0])
    }
  }, [
    customerServicePhones,
    isSuccess,
    currentPhone,
    defaultToFirst,
    handlePhoneSelection,
  ])
  return (
    <div className='space-y-1'>
      {label && <p className='text-sm font-medium'>{label}</p>}
      <Command className={'w-full rounded-lg border'}>
        <CommandInput
          placeholder={`Search ${label.toLowerCase()}...`}
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading
              ? 'Loading phones...'
              : !currentCopypoint
                ? 'Selecciona primero un copypoint'
                : 'No se encontraron teléfonos para este copypoint'}
          </CommandEmpty>
          <CommandGroup>
            {filteredPhones.map((phone) => (
              <CommandItem
                key={phone.id}
                value={phone.id.toString()}
                onSelect={handleSelectPhone}
                className={'h-10'}
              >
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    currentPhone?.id === phone.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {formatPhoneNumber(phone.phoneNumber)}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

export default PhoneSelector
