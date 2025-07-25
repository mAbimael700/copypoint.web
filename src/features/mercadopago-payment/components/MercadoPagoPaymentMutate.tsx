import { CreditCard } from 'lucide-react'
import {
  Card, CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import MercadoPagoPaymentForm from '@/features/mercadopago-payment/components/form/mercado-pago-payment-form'

const MercadoPagoPaymentMutate = () => {
  return (
    <>
      <Main className={'bg-muted space-y-4'}>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              Payment with MercadoPago
            </CardTitle>
            <CardDescription>
              Complete the information below to proceed with the payment.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardContent>

          <MercadoPagoPaymentForm />
          </CardContent>
        </Card>
      </Main>
    </>
  )
}

export default MercadoPagoPaymentMutate
