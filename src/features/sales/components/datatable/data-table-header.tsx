import { useEffect } from 'react'
import { Table } from '@tanstack/react-table'
import { CopypointCombobox } from '@/features/copypoints/components/copypoint-combobox.tsx'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts'
import useCopypoints from '@/features/copypoints/hooks/useCopypoint.ts'
import { SaleResponse } from '@/features/sales/Sale.type.ts'
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'
import { CopypointResponse } from '@/features/copypoints/Copypoint.type.ts'

const DataTableHeader = (_: Table<SaleResponse>) => {
  const { activeStore } = useStoreContext()
  const { copypoints } = useCopypoints(activeStore?.id || 0)
  const { setCurrentCopypoint, currentCopypoint } = useCopypointContext()

  function handleOnClick(s: CopypointResponse): void {
    setCurrentCopypoint(s)
  }

  useEffect(() => {
    if (!currentCopypoint && copypoints.length > 0) {
      setCurrentCopypoint(copypoints[0])
    }
  }, [currentCopypoint, copypoints, setCurrentCopypoint])

  if (copypoints.length === 1) return

  return (
    <>
      <div className={'text-sm font-semibold'}>Select copypoint</div>
      <CopypointCombobox
        onCopypointSelect={handleOnClick}
        label={
          currentCopypoint
            ? copypoints.find((s) => s.name === currentCopypoint.name)?.name
            : 'Select copypoint...'
        }
      />
    </>
  )
}

export default DataTableHeader
