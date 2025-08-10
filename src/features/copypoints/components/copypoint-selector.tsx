import React from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
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
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'
import type { CopypointResponse } from '../Copypoint.type'
import useCopypoint from '../hooks/useCopypoint'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts'

interface CopypointSelectorProps {
  label?: string
  selectedCopypoint?: CopypointResponse | null
  onCopypointSelect?: (copypoint: CopypointResponse) => void
  storeId?: number | string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const CopypointSelector: React.FC<CopypointSelectorProps> = ({
  label,
  selectedCopypoint: externalSelectedCopypoint,
  onCopypointSelect,
  storeId: externalStoreId,
  placeholder = 'Seleccionar copypoint',
  className,
  disabled = false,
}) => {
  // Contextos
  const { activeStore } = useStoreContext()
  const { currentCopypoint, setCurrentCopypoint } = useCopypointContext()

  // Determinar qué valores usar
  const storeId = externalStoreId || activeStore?.id || 0
  const selectedCopypoint = externalSelectedCopypoint !== undefined ? externalSelectedCopypoint : currentCopypoint

  // Estado del popover
  const [open, setOpen] = React.useState(false)

  // Obtener copypoints
  const { copypoints, isLoading } = useCopypoint(storeId)

  // Manejar la selección de copypoint
  const handleSelectCopypoint = (copypoint: CopypointResponse) => {
    // Si hay una función externa para manejar la selección, la usamos
    if (onCopypointSelect) {
      onCopypointSelect(copypoint)
    } else {
      // Si no, actualizamos el contexto
      setCurrentCopypoint(copypoint)
    }
    setOpen(false)
  }

  // Determinar el texto a mostrar en el botón
  const buttonText = selectedCopypoint?.name || placeholder
  const displayLabel = label || 'Copypoint'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn('justify-between', className)}
        >
          <span className="truncate">{buttonText}</span>
          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[240px] p-0'>
        <Command>
          <CommandInput placeholder={`Buscar ${displayLabel.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Cargando...' : 'No se encontraron resultados.'}
            </CommandEmpty>
            <CommandGroup>
              {copypoints.map((copypoint) => (
                <CommandItem
                  key={copypoint.id}
                  value={copypoint.name}
                  onSelect={() => handleSelectCopypoint(copypoint)}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedCopypoint?.id === copypoint.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {copypoint.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CopypointSelector
