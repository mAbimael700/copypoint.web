import Sales from '@/features/sales'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sales/')({
  component: Sales,
})
