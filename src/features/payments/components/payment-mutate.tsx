import { Main } from '@/components/layout/main'
import MercadoPagoAddPaymentBtn from '@/features/mercadopago-payment/components/input/mercado-pago-add-payment-btn'
import SaleProfileSimpleList from '@/features/saleprofile/components/sale-profile-simple-list'
import useSaleProfiles from '@/features/saleprofile/hooks/useSaleProfiles'


const PaymentMutate = () => {
  const {saleProfiles} = useSaleProfiles()
  return (
    <Main>
      <div>
        <MercadoPagoAddPaymentBtn className={'w-1/4'} />
      </div>

      <SaleProfileSimpleList saleProfiles={saleProfiles} />
    </Main>
  )
}

export default PaymentMutate