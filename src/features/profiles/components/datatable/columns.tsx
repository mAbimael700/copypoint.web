import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header.tsx'
import { DataTableRowActions } from '@/features/profiles/components/datatable/data-table-row-actions.tsx'
import { ProfileResponse } from '../../Profile.type.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils.currency.ts'

export const columns: ColumnDef<ProfileResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),

  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "unitPrice",
    header: "Unit price",
    cell: ({ row }) => {
      const { original } = row
      return formatCurrency(original.unitPrice)
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creation date",
    cell: ({ row }) => {
      const { original } = row
      return format(original.createdAt, "PPpp")
    }
  },
  {
    accessorKey: "modifiedAt",
    header: "Modification date",
    cell: ({ row }) => {
      const { original } = row
      return format(original.createdAt, "PPpp")
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {

      if (row.original.status) {
        return <Badge>Habilitado</Badge>
      }
      return <Badge>Inhabilitado</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
