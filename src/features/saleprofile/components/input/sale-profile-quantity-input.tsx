import React from 'react'
import { Control, FieldPath } from 'react-hook-form'
import { Minus, PencilLine, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer.tsx'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form.tsx'
import { SaleProfilesFormValues } from '../form/sale-profile-form.tsx'

interface SaleProfileQuantityDrawerProps {
  profileId: number
  serviceId: number
  profileName: string
  currentQuantity: number
  fieldIndex: number
  control: Control<SaleProfilesFormValues>
  onQuantityChange: (
    profileId: number,
    serviceId: number,
    increment: number
  ) => void
  onValueChange: (
    fieldName: string,
    profile: number,
    serviceId: number,
    value: number
  ) => void
}

export function SaleProfileQuantityDrawer({
  profileId,
  serviceId,
  profileName,
  currentQuantity,
  fieldIndex,
  control,
  onValueChange,
}: SaleProfileQuantityDrawerProps) {
  const fieldName =
    `profiles.${fieldIndex}.quantity` as FieldPath<SaleProfilesFormValues>

  // Estado local para mantener el valor dentro del drawer
  const [localValue, setLocalValue] = React.useState(currentQuantity)

  // Actualizar el estado local cuando cambia currentQuantity (para mantener sincronización)
  React.useEffect(() => {
    setLocalValue(currentQuantity)
  }, [currentQuantity])

  const handleInputChange = (value: string) => {
    const numValue = Math.max(1, Number(value) || 1)
    setLocalValue(numValue)
  }

  // Aplicar cambios al formulario cuando se cierra el drawer
  const applyChanges = () => {
    onValueChange(fieldName, profileId, serviceId, localValue)
  }

  // Usar el valor del formulario para mantener la vista previa actualizada
  const formValue = fieldIndex !== -1 ? currentQuantity : 1

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className='flex cursor-pointer items-center gap-2'>
          <PencilLine strokeWidth={1.25} height={20} />
          <div className='bg-primary text-primary-foreground border-background flex h-7 w-7 items-center justify-center rounded-full p-1.5 text-xs shadow-sm'>
            {formValue}
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto w-full max-w-sm'>
          <DrawerHeader>
            <DrawerTitle>Edit quantity</DrawerTitle>
            <DrawerDescription>
              Adjust quantity for profile: {profileName}
              <p className='text-muted-foreground mt-1 text-xs'>
                The changes will be applied to the form and saved when you
                submit the form.
              </p>
            </DrawerDescription>
          </DrawerHeader>

          <FormField
            control={control}
            name={fieldName}
            render={() => (
              <FormItem className='p-4 pb-0'>
                <div className='flex items-center justify-center space-x-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='h-8 w-8 shrink-0 rounded-full'
                    onClick={() => setLocalValue(Math.max(1, localValue - 1))}
                    disabled={localValue <= 1}
                  >
                    <Minus />
                    <span className='sr-only'>Decrease</span>
                  </Button>
                  <div className='flex-1 text-center'>
                    <input
                      type='number'
                      id='quantity-currency'
                      className='w-full [appearance:textfield] border-none bg-transparent text-center text-7xl leading-none font-bold tracking-tighter focus:ring-0 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                      value={localValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={(e) => handleInputChange(e.target.value)}
                    />
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='h-8 w-8 shrink-0 rounded-full'
                    onClick={() => setLocalValue(localValue + 1)}
                  >
                    <Plus />
                    <span className='sr-only'>Increase</span>
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
            <DrawerClose asChild>
              <Button className='w-full' onClick={applyChanges}>
                Apply
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
