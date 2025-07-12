import { Main } from '@/components/layout/main'
import MercadoPagoAddPaymentBtn from '@/features/mercadopago-payment/components/input/mercado-pago-add-payment-btn'


const PaymentMutate = () => {
  return (
    <Main>
      <div>
        <MercadoPagoAddPaymentBtn className={'w-1/4'} />
      </div>
    </Main>
  )
}

export default PaymentMutate