import React from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { useProfileModule } from '@/features/profiles/context/ProfileStore.ts'
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'
import type { Service } from '../../Service.type.ts'
import { useServiceByStoreOperations } from '../../hooks/useService.ts'

interface Props {
  label?: string
  handleOnClick: (s: Service) => void
}

export const ServiceCommand = ({
  handleOnClick,
  label = 'Select profile',
}: Props) => {
  const { activeStore } = useStoreContext()
  const { services } = useServiceByStoreOperations(activeStore?.id || 0)
  const { currentService } = useProfileModule()

  const [open, setOpen] = React.useState(false)

  const visibleServices = services.length > 4 ? services.slice(4) : services

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('h-8 w-[200px] justify-between')}
        >
          {label}
          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search service...' />
          <CommandList>
            <CommandEmpty>No service found.</CommandEmpty>
            <CommandGroup>
              {visibleServices.map((s) => (
                <CommandItem
                  key={s.name}
                  value={s.name}
                  onSelect={() => {
                    handleOnClick(s)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentService?.id === s.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {s.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
