import { createFileRoute } from '@tanstack/react-router'
import MercadoPagoPaymentMutate from '@/features/mercadopago-payment/components/MercadoPagoPaymentMutate'

export const Route = createFileRoute(
  '/_authenticated/payments/mercado-pago/add-payment/',
)({
  component: MercadoPagoPaymentMutate,
})

