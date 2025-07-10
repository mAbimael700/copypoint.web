import { cn } from '@/lib/utils'
import {
  MpHandshakeColorHorizontalIcon,
  MpHandshakePlumaHorizontalIcon,
} from '@/features/mercadopago-payment/components/icons/icons.tsx'

interface Props {
  className?: string
}

const MercadoPagoAddPaymentBtn = ({ className }: Props) => {
  return (
    <div
      className={cn(
        'group bg-primary text-secondary border-primary flex h-20 cursor-pointer items-center justify-center rounded-2xl shadow transition-colors hover:bg-[#ffe700]',
        className
      )}
    >
      Add payment
      <MpHandshakePlumaHorizontalIcon className='text-secondary h-36 w-36 group-hover:hidden' />
      <MpHandshakeColorHorizontalIcon className='text-secondary hidden h-36 w-36 group-hover:block' />
    </div>
  )
}

export default MercadoPagoAddPaymentBtn
