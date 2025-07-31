import { useState } from 'react'
import { Select } from '@radix-ui/react-select'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator.tsx'
import { Main } from '@/components/layout/main.tsx'
import { integrations } from '@/features/copypoints/integrations/components/add-integration/data.tsx'
import { useNavigate } from '@tanstack/react-router'

const appText = new Map<string, string>([
  ['all', 'All Integrations'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

const IntegrationList = () => {
  const [sort, setSort] = useState('ascending')
  const [appType, setAppType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  const filteredApps = integrations
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((integration) =>
      appType === 'connected'
        ? integration.isActive
        : appType === 'notConnected'
          ? !integration.isActive
          : true
    )
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
  return (
    <Main fixed>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>
          Copypoint Integrations
        </h1>
        <p className='text-muted-foreground'>
          Here&apos;s a list of apps for the integration!
        </p>
      </div>
      <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
        <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
          <Input
            placeholder='Filter integrations...'
            className='h-9 w-40 lg:w-[250px]'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={appType} onValueChange={setAppType}>
            <SelectTrigger className='w-42'>
              <SelectValue>{appText.get(appType)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All integrations</SelectItem>
              <SelectItem value='connected'>Connected</SelectItem>
              <SelectItem value='notConnected'>Not Connected</SelectItem>
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
        {filteredApps.map((app) => (
          <li key={app.name} className='rounded-lg border p-4 hover:shadow-md'>
            <div className='mb-8 flex items-center justify-between'>
              <div
                className={`bg-muted flex size-15 items-center justify-center rounded-lg p-2`}
              >
                {app.logo}
              </div>
              <Button
                onClick={() => {
                  navigate({ to: app.to })
                }}
                variant='outline'
                size='sm'
                className={`${app.isActive ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
              >
                {app.isActive ? 'Connected' : 'Connect'}
              </Button>
            </div>
            <div>
              <Badge className={'capitalize'}>{app.type}</Badge>
              <h2 className='mb-1 font-semibold'>{app.name}</h2>
              <p className='line-clamp-2 text-gray-500'>{app.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </Main>
  )
}

export default IntegrationList
