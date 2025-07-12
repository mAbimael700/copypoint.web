import { X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils.currency.ts'
import { cn } from '@/lib/utils.ts'
import { SaleProfileResponse } from '@/features/saleprofile/SaleProfile.type.ts'

interface Props {
  saleProfile: SaleProfileResponse
  className?: string
}

const SaleProfileItemDetail = ({ saleProfile, className }: Props) => {
  return (
    <div
      className={cn('flex h-10 items-center justify-between gap-2', className)}
    >
      <div>
        <div>{saleProfile.name}</div>
        <div className='text-muted-foreground text-sm'>
          {formatCurrency(saleProfile.unitPrice)}
        </div>
      </div>

      <div className='flex items-center gap-4' title='Quantity'>
        <div className='flex items-center gap-1' title='Quantity'>
          <X strokeWidth={1.5} size={20} /> {saleProfile.quantity}
        </div>
        <div className='font-semibold'>
          {formatCurrency(saleProfile.subtotal)}
        </div>
      </div>
    </div>
  )
}

export default SaleProfileItemDetail
