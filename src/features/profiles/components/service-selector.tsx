import useServices from '@/features/services/hooks/useService'
import type { Service } from '@/features/services/Service.type'
import { useStoreContext } from '@/features/stores/storage/useStoreContext'
import { useProfileModule } from '../storage/ProfileStore'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'


export const ServiceSelector = () => {
    const { activeStore } = useStoreContext()
    const { services } = useServices(activeStore?.id || 0)
    const { setCurrentService, currentService } = useProfileModule()

    const [open, setOpen] = React.useState(false)

    function handleOnClick(service: Service) {
        setCurrentService(service)
    }

    return (
        <div className='flex gap-4'>
            <div className=' bg-accent rounded-lg p-1 gap-2 flex'>

                {services.map(s =>
                    <Button className='h-7'
                        variant={"outline"}
                        onClick={() => handleOnClick(s)}
                        key={"service-selector" + s.id}>
                        {s.name}
                    </Button>)}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] h-8 justify-between"
                    >
                        {currentService
                            ? services.find((s) => s.name === currentService.name)?.name
                            : "Select profile..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search framework..." />
                        <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                                {services.map((s) => (
                                    <CommandItem
                                        key={s.name}
                                        value={s.name}
                                        onSelect={() => { handleOnClick(s) }}
                                    >
                                        <CheckIcon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                currentService?.id === s.id ? "opacity-100" : "opacity-0"
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
        </div>
    )
}
