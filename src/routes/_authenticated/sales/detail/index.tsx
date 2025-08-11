import { createFileRoute } from '@tanstack/react-router'
import SaleDetail from '@/features/sales/screens/sale-detail.tsx'

export const Route = createFileRoute('/_authenticated/sales/detail/')({
  component: SaleDetail,
})
