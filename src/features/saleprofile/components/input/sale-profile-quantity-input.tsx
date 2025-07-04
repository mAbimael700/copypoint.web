import { Button } from "@/components/ui/button.tsx"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer.tsx"
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form.tsx"
import { Minus, PencilLine, Plus } from "lucide-react"
import { Control, FieldPath } from "react-hook-form"
import { SaleProfilesFormValues } from "../form/sale-profile-form.tsx"

interface SaleProfileQuantityDrawerProps {
    profileId: number
    profileName: string
    currentQuantity: number
    fieldIndex: number
    control: Control<SaleProfilesFormValues>
    onQuantityChange: (profileId: number, increment: number) => void
    onValueChange: (fieldName: string, value: number) => void
}

export function SaleProfileQuantityDrawer({
    profileId,
    profileName,
    currentQuantity,
    fieldIndex,
    control,
    onQuantityChange,
    onValueChange
}: SaleProfileQuantityDrawerProps) {
    const fieldName = `profiles.${fieldIndex}.quantity` as FieldPath<SaleProfilesFormValues>

    const handleInputChange = (value: string) => {
        const numValue = Math.max(1, Number(value) || 1)
        onValueChange(fieldName, numValue)
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <div className="flex gap-2 items-center cursor-pointer">
                    <PencilLine strokeWidth={1.25} height={20} />
                    <div className="bg-primary text-primary-foreground p-1.5 text-xs rounded-full w-7 h-7 flex items-center justify-center border-background shadow-sm">
                        {currentQuantity}
                    </div>
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Quantity</DrawerTitle>
                        <DrawerDescription>
                            Set quantity for {profileName}
                        </DrawerDescription>
                    </DrawerHeader>

                    <FormField
                        control={control}
                        name={fieldName}
                        render={() => (
                            <FormItem className="p-4 pb-0">
                                <div className="flex items-center justify-center space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 rounded-full"
                                        onClick={() => onQuantityChange(profileId, -1)}
                                        disabled={currentQuantity <= 1}
                                    >
                                        <Minus />
                                        <span className="sr-only">Decrease</span>
                                    </Button>
                                    <div className="flex-1 text-center">
                                        <input
                                            type="number"
                                            className="text-7xl font-bold tracking-tighter bg-transparent border-none text-center w-full focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none leading-none"
                                            value={currentQuantity}
                                            onChange={(e) => handleInputChange(e.target.value)}
                                            onBlur={(e) => handleInputChange(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 rounded-full"
                                        onClick={() => onQuantityChange(profileId, 1)}
                                    >
                                        <Plus />
                                        <span className="sr-only">Increase</span>
                                    </Button>
                                    <FormControl>
                                        {/* <input type="hidden" {...field} /> */}
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <DrawerFooter>
                        <DrawerClose>
                            <Button className="w-full">Done</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}