import { useState } from 'react'
import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { Newspaper } from 'lucide-react'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CopypointResponse } from '@/features/copypoints/Copypoint.type.ts'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts'
import { useStoreContext } from '../stores/context/useStoreContext.ts'
import useCopypoint from './hooks/useCopypoint'

const appText = new Map<string, string>([
  ['all', 'All Apps'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export default function Copypoints() {
  const { activeStore } = useStoreContext()
  const { copypoints } = useCopypoint(activeStore?.id || 0)
  const { setCurrentCopypoint } = useCopypointContext()
  const navigate = useNavigate()

  const [sort, setSort] = useState('ascending')
  const [copypointStatus, setcopypointStatus] =
    useState<CopypointResponse['status']>('ACTIVE')
  const [searchTerm, setSearchTerm] = useState('')

  // Early return si no hay store seleccionado
  if (!activeStore) {
    return (
      <div className='copypoints-container'>
        <div className='empty-state'>
          <h2>Selecciona una tienda</h2>
          <p>Para ver los copypoints, primero selecciona una tienda activa.</p>
        </div>
      </div>
    )
  }

  const filteredCopypoints = copypoints
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((cp) => copypointStatus === cp.status)
    .filter((copypoint) =>
      copypoint.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  function handleManageCopypointBtn(copypoint: CopypointResponse) {
    setCurrentCopypoint(copypoint)
    navigate({
      to: '/copypoints/$copypointId',
      params: { copypointId: copypoint.id },
    })
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Copypoints</h1>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your store's copypoints!
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter copypoints...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={copypointStatus}
              onValueChange={(v) =>
                setcopypointStatus(v as CopypointResponse['status'])
              }
            >
              <SelectTrigger className='w-36'>
                <SelectValue>{appText.get(copypointStatus)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ACTIVE'>Active</SelectItem>
                <SelectItem value='INACTIVE'>Inactive</SelectItem>
                <SelectItem value='SUSPENDED'>Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow-sm' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {filteredCopypoints.map((c) => (
            <li key={c.name} className='rounded-lg border p-4 hover:shadow-md'>
              <div className='mb-8 flex items-center justify-between'>
                <div
                  className={`bg-muted flex size-10 items-center justify-center rounded-lg p-2`}
                >
                  <Newspaper />
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleManageCopypointBtn(c)}
                >
                  Manage
                </Button>
              </div>
              <div>
                <h2 className='mb-1 font-semibold'>{c.name}</h2>
                <p className='line-clamp-2 text-gray-500'>
                  {format(new Date(c.creationDate), 'PPpp')}
                </p>
                <Badge className={'capitalize'}>{c.status.toLowerCase()}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Main>
    </>
  )
}
