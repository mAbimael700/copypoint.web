import { createFileRoute } from '@tanstack/react-router'
import PaymentsBySale from '@/features/payments/payments-by-sale.tsx'

export const Route = createFileRoute('/_authenticated/sales/payments/')({
  component: PaymentsBySale,
})
