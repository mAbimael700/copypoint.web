import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useExchangeRateCodes } from "../hooks/useExchangeRate"

interface Props {
    label?: string
    value: string
    handleOnSelect: (ISO: string, description: string) => void
}

export function CurrencyCombobox({ label, value, handleOnSelect }: Props) {
    const { data } = useExchangeRateCodes()
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-[200px] justify-between",
                        !value && "text-muted-foreground"
                    )}
                >
                    {label ? label :
                        "Select currency"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>

            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search currency..."
                        className="h-9" />
                    <CommandList>
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                            {data?.supported_codes.map(([ISO, description]) => (
                                <CommandItem
                                    value={ISO}
                                    key={ISO}
                                    onSelect={() => { handleOnSelect(ISO, description) }}
                                >
                                    {ISO + " -"} {description}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            label === ISO
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
