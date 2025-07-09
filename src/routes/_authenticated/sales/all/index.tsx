import { createFileRoute } from '@tanstack/react-router'
import AllSales from '@/features/sales/components/AllSales.tsx'

export const Route = createFileRoute('/_authenticated/sales/all/')({
  component: AllSales,
})

