import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'
import { DataTable } from '../../components/data-table/data-table'
import { columns } from './components/datatable/columns.tsx'
import { ProfileHeader } from './components/datatable/data-table-header.tsx'
import { ProfileDialogs } from './components/profile-dialogs'
import { TasksPrimaryButtons } from './components/profile-primary-buttons'
import { useProfileByStoreOperations } from './hooks/useProfiles'

export default function Profiles() {
  const { activeStore } = useStoreContext()
  const { profiles } = useProfileByStoreOperations(activeStore?.id || 0)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Profiles</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your store services profiles!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable data={profiles} columns={columns} header={ProfileHeader} />
        </div>
      </Main>

      <ProfileDialogs />
    </>
  )
}
