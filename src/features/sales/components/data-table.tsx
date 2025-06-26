import { CopypointCommand } from '@/features/copypoints/components/copypoint-command'
import { CopypointResponse } from '@/features/copypoints/Copypoint.type'
import useCopypoints from '@/features/copypoints/hooks/useCopypoint'
import { useCopypointModule } from '@/features/copypoints/storage/useCopypointStorage'
import { useStoreContext } from '@/features/stores/storage/useStoreContext'
import useSalesOperations from '../hooks/useSales'
import { DataTable } from '@/components/data-table/data-table'
import { columns } from './columns'
import { SaleResponse } from '../Sale.type'
import { Table } from '@tanstack/react-table'



export const DataTableSalesPending = () => {

    const { activeStore } = useStoreContext()
    const { copypoints } = useCopypoints(activeStore?.id || 0)
    const { setCurrentCopypoint, currentCopypoint } = useCopypointModule()
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
