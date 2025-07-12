import MercadoPagoAddPaymentBtn from '@/features/mercadopago-payment/components/input/mercado-pago-add-payment-btn'
import { Main } from '@/components/layout/main'


const PaymentForm = () => {
  return (
    <Main>
      <div>
        <MercadoPagoAddPaymentBtn className={'w-1/4'} />
      </div>
    </Main>
  )
}

export default PaymentForm
