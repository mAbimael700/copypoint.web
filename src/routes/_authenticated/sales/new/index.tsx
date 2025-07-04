import { CreateSaleForm } from '@/features/sales/components/form/create-sale-form.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sales/new/')({
  component: CreateSaleForm,
})
