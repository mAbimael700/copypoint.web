import { useEffect } from 'react'
import { Table } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table.tsx'
import { CopypointResponse } from '@/features/copypoints/Copypoint.type.ts'
import { CopypointCommand } from '@/features/copypoints/components/copypoint-command.tsx'
import useCopypoints from '@/features/copypoints/hooks/useCopypoint.ts'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts'
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'
import { SaleResponse } from '../../Sale.type.ts'
import useSalesOperations from '../../hooks/useSales.ts'
import { columns } from './columns.tsx'

export const DataTableSales = () => {
  const { activeStore } = useStoreContext()
  const { copypoints } = useCopypoints(activeStore?.id || 0)
  const { setCurrentCopypoint, currentCopypoint } = useCopypointContext()
  const { sales } = useSalesOperations()

  function handleOnClick(s: CopypointResponse): void {
    setCurrentCopypoint(s)
  }

  function h(_: Table<SaleResponse>) {

    if (copypoints.length === 1) return

    
    return (
      <CopypointCommand
        handleOnClick={handleOnClick}
        label={
          currentCopypoint
            ? copypoints.find((s) => s.name === currentCopypoint.name)?.name
            : 'Select copypoint...'
        }
      />
    )
  }

  useEffect(() => {
    if (!currentCopypoint && copypoints.length > 0) {
      setCurrentCopypoint(copypoints[0])
    }
  }, [currentCopypoint, copypoints, setCurrentCopypoint])

  return (
    <div>
      <DataTable columns={columns} data={sales} header={h} />
    </div>
  )
}
