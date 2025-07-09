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

interface Props {
  label?: string
  handleOnClick: (s: CopypointResponse) => void
}

export const CopypointCommand = ({
  handleOnClick,
  label = 'Select copypoint',
}: Props) => {
  const { activeStore } = useStoreContext()
  const { copypoints } = useCopypoint(activeStore?.id || 0)
  const { currentCopypoint } = useCopypointContext()

  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='h-8 w-[200px] justify-between'
        >
          {!currentCopypoint ? label : currentCopypoint.name}
          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search copypoint...' />
          <CommandList>
            <CommandEmpty>No copypoint found.</CommandEmpty>
            <CommandGroup>
              {copypoints.map((s) => (
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
                      currentCopypoint?.id === s.id
                        ? 'opacity-100'
                        : 'opacity-0'
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
