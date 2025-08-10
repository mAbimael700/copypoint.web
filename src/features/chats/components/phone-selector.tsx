import React, { useEffect } from 'react'
import { CheckIcon, ChevronsUpDownIcon, PhoneIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import { useCustomerServicePhoneContext } from '@/features/chats/context/useCustomerServicePhoneContext'
import useCustomerServicePhone from '@/features/chats/hooks/useCustomerServicePhone'
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
  placeholder = 'Seleccionar teléfono',
  className,
  disabled = false,
  onPhoneSelect,
  defaultToFirst = true,
}) => {
  // Contextos
  const { currentCopypoint } = useCopypointContext()
  const { currentPhone, setCurrentPhone } = useCustomerServicePhoneContext()

  // Estados
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  // Consulta de teléfonos para el copypoint actual
  const { customerServicePhones, isLoading, isSuccess } = useCustomerServicePhone()

  // Establecer el primer teléfono como seleccionado cuando se cargan los teléfonos
  useEffect(() => {
    if (defaultToFirst && isSuccess && customerServicePhones.length > 0 && !currentPhone) {
      handlePhoneSelection(customerServicePhones[0])
    }
  }, [customerServicePhones, isSuccess, currentPhone, defaultToFirst])

  // Formatear el número de teléfono para mostrar
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return ''

    try {
      return phone.replace(/\D+/g, '')
        .replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')
    } catch (e) {
      return phone
    }
  }

  // Filtrar teléfonos por búsqueda
  const filteredPhones = searchValue.trim() === ''
    ? customerServicePhones
    : customerServicePhones.filter(phone => 
        phone.phoneNumber.toLowerCase().includes(searchValue.toLowerCase()))

  // Manejar la selección de un teléfono
  const handlePhoneSelection = (phone: CustomerServicePhone) => {
    if (onPhoneSelect) {
      onPhoneSelect(phone)
    } else {
      setCurrentPhone(phone)
    }
    setOpen(false)
  }

  const handleSelectPhone = (phoneId: string) => {
    const selectedPhone = customerServicePhones.find(phone => phone.id.toString() === phoneId)
    if (selectedPhone) {
      handlePhoneSelection(selectedPhone)
    }
  }

  return (
    <div className="space-y-1">
      {label && <p className="text-sm font-medium">{label}</p>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            disabled={disabled || !currentCopypoint}
            className={cn('w-full justify-between', className)}
          >
            {isLoading ? (
              <Skeleton className="h-4 w-[120px]" />
            ) : (
              <span className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {currentPhone 
                    ? formatPhoneNumber(currentPhone.phoneNumber)
                    : (customerServicePhones.length > 0 
                      ? formatPhoneNumber(customerServicePhones[0].phoneNumber)
                      : placeholder)}
                </span>
              </span>
            )}
            <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[240px] p-0'>
          <Command>
            <CommandInput 
              placeholder={`Buscar ${label.toLowerCase()}...`} 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading 
                  ? 'Cargando teléfonos...'
                  : !currentCopypoint
                    ? 'Selecciona primero un copypoint'
                    : 'No se encontraron teléfonos para este copypoint'}
              </CommandEmpty>
              <CommandGroup>
                {filteredPhones.map(phone => (
                  <CommandItem
                    key={phone.id}
                    value={phone.id.toString()}
                    onSelect={handleSelectPhone}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        currentPhone?.id === phone.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {formatPhoneNumber(phone.phoneNumber)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default PhoneSelector
