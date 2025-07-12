import { cn } from '@/lib/utils'
import {
  MpHandshakeColorHorizontalIcon,
  MpHandshakePlumaHorizontalIcon,
} from '@/features/mercadopago-payment/components/icons/icons.tsx'
import { useNavigate } from '@tanstack/react-router'

interface Props {
  className?: string
  disabled?: boolean
}

const MercadoPagoAddPaymentBtn = ({ className, disabled = false }: Props) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (!disabled) {
      navigate({ to: '/payments/mercado-pago/add-payment' })
    }
  }

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'group text-sm p-4 flex h-20 min-h-2/4 items-center justify-center rounded-2xl shadow transition-colors',
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-primary text-secondary border-primary cursor-pointer hover:bg-[#ffe700]',
        className
      )}
    >
      Add payment
      <MpHandshakePlumaHorizontalIcon
        className={cn(
          'h-36 w-36',
          disabled ? 'opacity-50' : 'text-secondary group-hover:hidden'
        )}
      />
      <MpHandshakeColorHorizontalIcon
        className={cn(
          'hidden h-36 w-36',
          disabled ? 'opacity-50' : 'text-secondary group-hover:block'
        )}
      />
    </button>
  )
}

export default MercadoPagoAddPaymentBtn
