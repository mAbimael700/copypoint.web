import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useServiceContext } from '../context/service-module-context'


export function TasksPrimaryButtons() {
  const { setOpen } = useServiceContext()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
