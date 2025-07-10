import { MpHandshakePlumaHorizontalIcon } from '@/features/mercadopago-payment/components/icons/icons.tsx'

const MercadoPagoAddPaymentBtn = () => {
  return (
    <div
      className={
        'bg-primary text-secondary cursor-pointer border-primary flex h-20 hover:bg-[#ffe700] transition-colors items-center justify-center rounded-2xl shadow'
      }
    >
      Add payment
      <MpHandshakePlumaHorizontalIcon ={'text-secondary h-36 w-36'}/>
    </div>
  )
}

export default MercadoPagoAddPaymentBtn