import { DataTable } from '@/components/data-table/data-table'
import { usePaymentBySale } from '@/features/payments/hooks/usePayments.ts'
import { columns } from './columns'

export const DataTablePaymentsBySale = () => {
  const { payments } = usePaymentBySale()

  return <DataTable columns={columns} data={payments} />
}
