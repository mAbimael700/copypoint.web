import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext.ts'
import { SaleResponse } from '../../Sale.type.ts'

interface DataTableRowActionsProps {
  row: Row<SaleResponse>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setCurrentSale } = useSaleContext()
  const navigate = useNavigate()

  const handleEditSale = async () => {
    setCurrentSale(row.original)
    await navigate({ to: '/sales/profiles' })
  }

  const handleDetailSale = async () => {
    setCurrentSale(row.original)
    await navigate({ to: '/sales/detail' })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleDetailSale}>Details</DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleEditSale}
          disabled={row.original.status.toString() != "PENDING"}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
