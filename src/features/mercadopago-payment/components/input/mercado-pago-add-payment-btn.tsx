import { MpHandshakePlumaHorizontalIcon } from '@/features/mercadopago-payment/components/icons/icons.tsx'

const MercadoPagoAddPaymentBtn = () => {
  return (
    <div
      className={
        'bg-primary text-secondary border-primary flex h-20 cursor-pointer items-center justify-center rounded-2xl shadow transition-colors hover:bg-[#ffe700]'
      }
    >
      Add payment
      <MpHandshakePlumaHorizontalIcon className={'text-secondary h-36 w-36'} />
    </div>
  )
}

export default MercadoPagoAddPaymentBtn
