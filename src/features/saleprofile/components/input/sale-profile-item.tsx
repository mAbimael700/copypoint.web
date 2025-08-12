import { UseFormReturn } from 'react-hook-form'
import { X, Paperclip } from 'lucide-react'
import { formatCurrency } from '@/lib/utils.currency.ts'
import { Button } from '@/components/ui/button.tsx'
import { SaleProfileResponse } from '@/features/saleprofile/SaleProfile.type.ts'
import { SaleProfilesFormValues } from '@/features/saleprofile/components/form/sale-form-schema.ts'
import { SaleProfileQuantityDrawer } from '@/features/saleprofile/components/input/sale-profile-quantity-input.tsx'
import { Badge } from '@/components/ui/badge'

// Tipo extendido para permitir perfiles temporales que no están en la API
type TempSaleProfile = {
  profileId: number
  name: string
  description: string
  unitPrice: number
  quantity: number
  service: {
    id: number
    name: string
  }
}

interface Props {
  saleProfile: SaleProfileResponse | TempSaleProfile
  currentQuantity: number
  fieldIndex: number
  isModified?: boolean
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
  isModified = false,
  form,
}: Props) => {
  // Verificar si el perfil tiene un attachment
  const hasAttachment = 'attachment' in saleProfile && saleProfile.attachment

  return (
    <li className={`flex items-center justify-between py-2 h-15 ${isModified ? 'bg-amber-50/50 rounded px-2 border-l-2 border-amber-400' : ''}`}>
      <div className='space-y-1'>
        <div className="flex items-center gap-1">
          {saleProfile.name} - <span>{saleProfile.description}</span>
          {isModified && (
            <span className="text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
              Modificado
            </span>
          )}
        </div>
        <div className='text-muted-foreground text-sm'>
          {formatCurrency(saleProfile.unitPrice)}
        </div>
        
        {/* Indicador de attachment */}
        {hasAttachment && (
          <div className='flex items-center gap-2 text-xs text-blue-600'>
            <Paperclip className='h-3 w-3' />
            <span className='font-medium'>
              {saleProfile.attachment.originalName}
            </span>
            {saleProfile.attachment.pages && (
              <Badge variant='outline' className='text-xs px-1.5 py-0.5'>
                {saleProfile.attachment.pages} páginas
              </Badge>
            )}
          </div>
        )}
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
