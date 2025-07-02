import useProfileOperations from '../hooks/useProfiles'
import { ProfileResponse } from '../Profile.type'
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { } from "@/components/ui/dialog"
import { Check, ChevronsUpDown } from "lucide-react"
import { useStoreContext } from '@/features/stores/storage/useStoreContext'
import React from 'react'
import { formatCurrency } from '@/lib/utils.currency'

interface Props {
    label?: string
    value?: number
    handleOnSelect: (profile: ProfileResponse) => void,
    placeholder?: string
    className?: string
}

export function ProfilesCombobox({
    label,
    value,
    handleOnSelect,
    placeholder = "Select profile",
}: Props) {
    const [open, setOpen] = React.useState(false)
    const { activeStore } = useStoreContext()
    const { profiles, currentService } = useProfileOperations(activeStore?.id || 0)
    // Encontrar el payment method seleccionado basado en el value (ID)
    const selectedProfile = profiles?.find(p => p.id === value)

    if (currentService) {
        placeholder = `Select ${currentService.name.toLocaleLowerCase()} profile`
    }

    // Determinar qué mostrar en el botón
    const displayText = label || selectedProfile?.description || placeholder



    return (
        <>
            <Button
                variant="outline"
                role="combobox"
                onClick={(e) => {
                    e.preventDefault()
                    setOpen((prev) => !prev)
                }}
                className={cn(
                    "justify-between w-full",
                    !value && "text-muted-foreground"
                )}
            >
                {displayText}
                <ChevronsUpDown className="opacity-50" />
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder={`Search ${currentService?.name.toLocaleLowerCase()} profile...`}
                    className="h-9" />
                <CommandList>
                    <CommandEmpty>No {currentService?.name.toLocaleLowerCase()} profile found.</CommandEmpty>
                    <CommandGroup>
                        {profiles?.map((pm) => (
                            <CommandItem
                                className='justify-between'
                                value={pm.description}
                                key={pm.id}
                                onSelect={() => {
                                    handleOnSelect(pm)
                                    setOpen(false)
                                }}
                            >
                                <div className='space-y-1'>
                                    <div>{pm.name}</div>
                                    <div className='text-xs text-muted-foreground'>{pm.description}</div>
                                </div>

                                <div>

                                    <div>{formatCurrency(pm.unitPrice)}</div>
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === pm.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )} />
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
