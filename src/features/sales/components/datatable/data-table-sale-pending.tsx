import { DataTable } from '@/components/data-table/data-table.tsx'
import { columns } from '@/features/sales/components/datatable/columns.tsx'
import DataTableHeader from '@/features/sales/components/datatable/data-table-header.tsx'
import useSalesOperations from '@/features/sales/hooks/useSales.ts'

export const DataTableSalesPending = () => {
  const { sales } = useSalesOperations()

  return (
    <div>
      <DataTable columns={columns} data={sales} header={DataTableHeader} />
    </div>
  )
}
