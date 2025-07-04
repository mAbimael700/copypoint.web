import { CopypointCommand } from '@/features/copypoints/components/copypoint-command.tsx'
import { CopypointResponse } from '@/features/copypoints/Copypoint.type.ts'
import useCopypoints from '@/features/copypoints/hooks/useCopypoint.ts'
import { useCopypointContext } from '@/features/copypoints/storage/useCopypointStorage.ts'
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'
import useSalesOperations from '../../hooks/useSales.ts'
import { DataTable } from '@/components/data-table/data-table.tsx'
import { columns } from './columns.tsx'
import { SaleResponse } from '../../Sale.type.ts'
import { Table } from '@tanstack/react-table'



export const DataTableSalesPending = () => {

    const { activeStore } = useStoreContext()
    const { copypoints } = useCopypoints(activeStore?.id || 0)
    const { setCurrentCopypoint, currentCopypoint } = useCopypointContext()
    const { pendingSales } = useSalesOperations()

    function handleOnClick(s: CopypointResponse): void {
        setCurrentCopypoint(s)
    }

    function h(_: Table<SaleResponse>) {
        return <CopypointCommand handleOnClick={handleOnClick} label={
            currentCopypoint
                ? copypoints.find((s) => s.name === currentCopypoint.name)?.name
                : "Select copypoint..."} />
    }

    return (
        <div>
            <DataTable columns={columns} data={pendingSales} header={h} />
        </div>

    )
}
