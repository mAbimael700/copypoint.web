import { CreateSaleForm } from '@/features/sales/components/create-sale-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sales/new/')({
  component: CreateSaleForm,
})
