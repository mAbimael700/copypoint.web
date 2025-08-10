import React from 'react'
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
import { CopypointSelector } from '@/features/copypoints/components/copypoint-selector'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import { CustomerServicePhone } from '@/features/chats/types/CustomerServicePhone.type'
import { useCustomerServicePhoneContext } from '@/features/chats/context/useCustomerServicePhoneContext'
import useCustomerServicePhone from '@/features/chats/hooks/useCustomerServicePhone'

interface CustomerServicePhoneSelectorProps {
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  showCopypointSelector?: boolean
  onPhoneSelect?: (phone: CustomerServicePhone) => void
}

const CustomerServicePhoneSelector: React.FC<CustomerServicePhoneSelectorProps> = ({
  label = 'Teléfono',
  placeholder = 'Seleccionar teléfono',
  className,
  disabled = false,
  showCopypointSelector = true,
  onPhoneSelect,
}) => {
  // Contextos
  const { currentCopypoint } = useCopypointContext()
  const { currentPhone, setCurrentPhone } = useCustomerServicePhoneContext()

  // Estados
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  // Consultas
  const { customerServicePhones, isLoading } = useCustomerServicePhone()

  // Formatea el número de teléfono para mostrar
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return ''

    // Intenta formatear como número telefónico
    try {
      return phone.replace(/\D+/g, '')
        .replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return phone
    }
  }

  // Manejar la selección de teléfono
  const handleSelectPhone = (phoneId: string) => {
    const selectedPhone = customerServicePhones.find(phone => phone.id.toString() === phoneId)
    if (selectedPhone) {
      if (onPhoneSelect) {
        onPhoneSelect(selectedPhone)
      } else {
        setCurrentPhone(selectedPhone)
      }
      setOpen(false)
    }
  }

  // Filtrar teléfonos por búsqueda
  const filteredPhones = searchValue.trim() === ''
    ? customerServicePhones
    : customerServicePhones.filter(phone => 
        phone.phoneNumber.toLowerCase().includes(searchValue.toLowerCase()))

  // Determinar el texto a mostrar en el botón
  const buttonText = currentPhone?.phoneNumber 
    ? formatPhoneNumber(currentPhone.phoneNumber) 
    : (customerServicePhones[0]?.phoneNumber 
      ? formatPhoneNumber(customerServicePhones[0].phoneNumber) 
      : placeholder)

  return (
    <div className="space-y-2">
      {showCopypointSelector && (
        <div className="space-y-1">
          <p className="text-sm font-medium">Copypoint</p>
          <CopypointSelector />
        </div>
      )}

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
                  <span className="truncate">{buttonText}</span>
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
                  {isLoading ? 'Cargando...' : 'No se encontraron teléfonos para este copypoint.'}
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
    </div>
  )
}

export default CustomerServicePhoneSelector
