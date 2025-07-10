import { createFileRoute } from '@tanstack/react-router'
import PaymentForm from '@/features/payments/components/payment-form'

export const Route = createFileRoute(
  '/_authenticated/sales/detail/add-payment/',
)({
  component: PaymentForm,
})
