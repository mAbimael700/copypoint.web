import { DataTable } from '@/components/data-table/data-table.tsx'
import useSalesOperations from '../../hooks/useSales.ts'
import { columns } from './columns.tsx'
import DataTableHeader from '@/features/sales/components/datatable/data-table-header.tsx'

export const DataTableSales = () => {

  const { sales } = useSalesOperations()

  return (
    <div>
      <DataTable columns={columns} data={sales} header={DataTableHeader} />
    </div>
  )
}
