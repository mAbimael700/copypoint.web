import { UseFormReturn } from 'react-hook-form'
import { X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils.currency.ts'
import { Button } from '@/components/ui/button.tsx'
import { SaleProfileResponse } from '@/features/saleprofile/SaleProfile.type.ts'
import { SaleProfilesFormValues } from '@/features/saleprofile/components/form/sale-form-schema.ts'
import { SaleProfileQuantityDrawer } from '@/features/saleprofile/components/input/sale-profile-quantity-input.tsx'

interface Props {
  saleProfile: SaleProfileResponse
  currentQuantity: number
  fieldIndex: number
  handleQuantityChange: (
    profileId: number,
    serviceId: number,
    increment: number
  ) => void
  handleValueChange: (
    fieldName: string,
    profileId: number,
    serviceId: number,
    value: number
  ) => void
  handleRemoveProfile: (profileId: number) => void
  form: UseFormReturn<SaleProfilesFormValues>
}

export const SaleProfileItem = ({
  saleProfile,
  fieldIndex,
  handleRemoveProfile,
  handleQuantityChange,
  handleValueChange,
  currentQuantity,
  form,
}: Props) => {
  return (
    <li className='flex items-center justify-between py-2 h-15'>
      <div className='space-y-1'>
        <div>
          {saleProfile.name} - <span>{saleProfile.description}</span>
        </div>
        <div className='text-muted-foreground text-sm'>
          {formatCurrency(saleProfile.unitPrice)}
        </div>
      </div>

      <div className='flex items-center gap-5'>
        <SaleProfileQuantityDrawer
          serviceId={saleProfile.service.id}
          profileId={saleProfile.profileId}
          profileName={saleProfile.description}
          currentQuantity={currentQuantity}
          fieldIndex={fieldIndex}
          control={form.control}
          onQuantityChange={handleQuantityChange}
          onValueChange={handleValueChange}
        />

        <Button
          type='button'
          size={'icon'}
          onClick={(e) => {
            e.preventDefault()
            handleRemoveProfile(saleProfile.profileId)
          }}
          className='bg-muted-foreground hover:bg-destructive hover:border-destructive text-muted text border-background h-4 w-4 justify-center rounded-full p-2.5 text-xs shadow-sm select-none'
        >
          <X size={10} />
          <span className='sr-only'>Delete</span>
        </Button>
      </div>
    </li>
  )
}
