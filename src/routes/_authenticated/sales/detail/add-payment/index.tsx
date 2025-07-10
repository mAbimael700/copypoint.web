import { createFileRoute } from '@tanstack/react-router'
import PaymentMutate from '@/features/mercadopago-payment/components/PaymentMutate.tsx'

export const Route = createFileRoute(
  '/_authenticated/sales/detail/add-payment/',
)({
  component: PaymentMutate,
})
