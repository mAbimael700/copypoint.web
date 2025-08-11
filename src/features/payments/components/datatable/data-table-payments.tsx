import { useEffect } from 'react'
import { Table } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { CopypointResponse } from '@/features/copypoints/Copypoint.type'
import { CopypointCombobox } from '@/features/copypoints/components/copypoint-combobox.tsx'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import useCopypoints from '@/features/copypoints/hooks/useCopypoint'
import usePayments from '@/features/payments/hooks/usePayments.ts'
import { useStoreContext } from '@/features/stores/context/useStoreContext'
import { PaymentResponse } from '../../types/Payment.type'
import { columns } from './columns'

export const DataTablePayments = () => {
  const { activeStore } = useStoreContext()
  const { copypoints } = useCopypoints(activeStore?.id || 0)
  const { setCurrentCopypoint, currentCopypoint } = useCopypointContext()
  const { payments } = usePayments()

  function handleOnClick(copypoint: CopypointResponse): void {
    setCurrentCopypoint(copypoint)
  }

  function headerContent(_: Table<PaymentResponse>) {
    if (copypoints.length === 1) return

    return (
      <>
        <div className={'text-sm font-semibold'}>Select copypoint</div>
        <CopypointCombobox
          onCopypointSelect={handleOnClick}
          label={
            currentCopypoint
              ? copypoints.find((s) => s.name === currentCopypoint.name)?.name
              : 'Seleccionar copypoint...'
          }
        />
      </>
    )
  }

  useEffect(() => {
    if (!currentCopypoint && copypoints.length > 0) {
      setCurrentCopypoint(copypoints[0])
    }
  }, [currentCopypoint, copypoints, setCurrentCopypoint])

  return (
    <div>
      <DataTable columns={columns} data={payments} header={headerContent} />
    </div>
  )
}
