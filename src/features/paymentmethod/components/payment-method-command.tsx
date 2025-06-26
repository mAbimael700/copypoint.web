import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { usePaymentMethodsList } from "../hooks/usePaymentMethods"
import { PaymentMethod } from "../PaymentMethod.type"


interface Props {
    label?: string
    value?: number
    handleOnSelect: (paymentMethod: PaymentMethod) => void,
    placeholder?: string
    className?: string
}

export function PaymentMethodsCombobox({
    label,
    value,
    handleOnSelect,
    placeholder = "Select payment method",
}: Props) {

    const { data: paymentMethods } = usePaymentMethodsList()
    // Encontrar el payment method seleccionado basado en el value (ID)
    const selectedPaymentMethod = paymentMethods?.find(pm => pm.id === value)

    // Determinar qué mostrar en el botón
    const displayText = label || selectedPaymentMethod?.description || placeholder

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
                    {displayText}
                    <ChevronsUpDown className="opacity-50" />
                </Button>

            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search payment method..."
                        className="h-9" />
                    <CommandList>
                        <CommandEmpty>No payment method found.</CommandEmpty>
                        <CommandGroup>
                            {paymentMethods?.map((pm) => (
                                <CommandItem
                                    value={pm.description}
                                    key={pm.id}
                                    onSelect={() => { handleOnSelect(pm) }}
                                >
                                    {pm.description}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === pm.id
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
