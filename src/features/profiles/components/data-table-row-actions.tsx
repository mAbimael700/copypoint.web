import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuShortcut,

  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProfileModule } from '../storage/ProfileStore'
import { ProfileResponse } from '../Profile.type'


interface DataTableRowActionsProps {
  row: Row<ProfileResponse>
}

export function DataTableRowActions({
  row,
}: DataTableRowActionsProps) {
  const { setOpen, setCurrentProfile } = useProfileModule()

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
        <DropdownMenuItem
          onClick={() => {
            setCurrentProfile(row.original)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setCurrentProfile(row.original)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
