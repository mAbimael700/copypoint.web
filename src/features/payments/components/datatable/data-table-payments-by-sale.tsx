
import { DataTable } from '@/components/data-table/data-table'
import { columns } from './columns'
import usePayments from '@/features/payments/hooks/usePayments.ts'

export const DataTablePaymentsBySale = () => {
  const { payments } = usePayments()

  return (
      <DataTable columns={columns} data={payments}/>
  )
}
