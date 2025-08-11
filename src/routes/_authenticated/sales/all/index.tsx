import { createFileRoute } from '@tanstack/react-router'
import SaleList from '@/features/sales/screens/sale-list.tsx'

export const Route = createFileRoute('/_authenticated/sales/all/')({
  component: SaleList,
})

