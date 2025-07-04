import React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils.currency'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import '@/components/ui/dialog'
import { useServiceContext } from '@/features/services/context/service-module-context.tsx'
import { ProfileResponse } from '../Profile.type'

interface Props {
  label?: string
  value?: number
  profiles: ProfileResponse[]
  handleOnSelect: (profile: ProfileResponse) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function ProfilesCombobox({
  label,
  value,
  handleOnSelect,
  profiles,
  placeholder = 'Select profile',
}: Props) {
  const [open, setOpen] = React.useState(false)
  const { currentService } = useServiceContext()
  // Encontrar el payment method seleccionado basado en el value (ID)
  const selectedProfile = profiles?.find((p) => p.id === value)

  // Determinar qué mostrar en el botón
  const displayText = label || selectedProfile?.description || placeholder

  return (
    <>
      <Button
        variant='outline'
        role='combobox'
        onClick={(e) => {
          e.preventDefault()
          setOpen((prev) => !prev)
        }}
        className={cn(
          'w-full justify-between',
          !value && 'text-muted-foreground'
        )}
      >
        {displayText}
        <ChevronsUpDown className='opacity-50' />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={`Search ${currentService?.name.toLowerCase()} profile...`} className='h-9' />
        <CommandList>
          <CommandEmpty>No {currentService?.name} profile found.</CommandEmpty>
          <CommandGroup>
            {profiles?.map((pm) => (
              <CommandItem
                className='justify-between'
                value={pm.description + pm.name}
                key={pm.id}
                onSelect={() => {
                  handleOnSelect(pm)
                  setOpen(false)
                }}
              >
                <div className='space-y-1'>
                  <div>{pm.name}</div>
                  <div className='text-muted-foreground text-xs'>
                    {pm.description}
                  </div>
                </div>

                <div>
                  <div>{formatCurrency(pm.unitPrice)}</div>
                  <Check
                    className={cn(
                      'ml-auto',
                      value === pm.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
