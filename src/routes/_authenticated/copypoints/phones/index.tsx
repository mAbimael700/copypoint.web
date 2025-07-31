import { createFileRoute } from '@tanstack/react-router'
import CustomerServicePhone from '@/features/customer-service-phones'

export const Route = createFileRoute('/_authenticated/copypoints/phones/')(
  {
    component: CustomerServicePhone,
  },
)


