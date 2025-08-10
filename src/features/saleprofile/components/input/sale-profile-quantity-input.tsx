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
  onQuantityChange,
  onValueChange,
}: SaleProfileQuantityDrawerProps) {
  const fieldName =
    `profiles.${fieldIndex}.quantity` as FieldPath<SaleProfilesFormValues>

  const handleInputChange = (value: string) => {
    const numValue = Math.max(1, Number(value) || 1)
    onValueChange(fieldName, profileId, serviceId, numValue)
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
            <DrawerTitle>Editar Cantidad</DrawerTitle>
            <DrawerDescription>
              Ajusta la cantidad para: {profileName}
              <p className="text-xs text-muted-foreground mt-1">
                Los cambios se aplicarán al formulario y se guardarán cuando envíes el formulario
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
                    onClick={() => onQuantityChange(profileId, serviceId, -1)}
                    disabled={formValue <= 1}
                  >
                    <Minus />
                    <span className='sr-only'>Decrease</span>
                  </Button>
                  <div className='flex-1 text-center'>
                    <input
                      type='number'
                      id='quantity-currency'
                      className='w-full [appearance:textfield] border-none bg-transparent text-center text-7xl leading-none font-bold tracking-tighter focus:ring-0 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                      value={formValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={(e) => handleInputChange(e.target.value)}
                    />
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='h-8 w-8 shrink-0 rounded-full'
                    onClick={() => onQuantityChange(profileId, serviceId, 1)}
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
            <DrawerClose>
              <Button className='w-full'>Aplicar al Formulario</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
