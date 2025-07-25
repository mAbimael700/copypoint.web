import { createFileRoute } from '@tanstack/react-router'
import PaymentMutate from '@/features/payments/components/payment-mutate'

export const Route = createFileRoute(
  '/_authenticated/sales/detail/add-payment/',
)({
  component: PaymentMutate,
})
