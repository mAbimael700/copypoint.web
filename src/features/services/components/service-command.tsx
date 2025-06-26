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
import { Button } from "@/components/ui/button"
import { useStoreContext } from "@/features/stores/storage/useStoreContext"
import useServices from "../hooks/useService"
import { useProfileModule } from "@/features/profiles/storage/ProfileStore"
import type { Service } from "../Service.type"

interface Props {
    label?: string
    handleOnClick: (s: Service) => void
}

export const ServiceCommand = ({ handleOnClick, label = "Select profile" }: Props) => {
    const { activeStore } = useStoreContext()
    const { services } = useServices(activeStore?.id || 0)
    const { currentService } = useProfileModule()

    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] h-8 justify-between"
                >
                    {label}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search service..." />
                    <CommandList>
                        <CommandEmpty>No service found.</CommandEmpty>
                        <CommandGroup>
                            {services.map((s) => (
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
    )
}
