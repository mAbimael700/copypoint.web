import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ServiceDialogs } from './components/service-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/service-module-context'
import useServices from './hooks/useService'
import { useStoreContext } from '../stores/storage/useStoreContext'
import { ServiceCard } from './components/service-card'

export default function Services() {
  const { activeStore } = useStoreContext()
  const { services } = useServices(activeStore?.id || 0)

  return (
    <TasksProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Services</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your store services!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>

          <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
            {services.map(s =>
              <ServiceCard service={s} key={"card" + s.id} />
            )}
          </ul>
          
        </div>
      </Main>

      <ServiceDialogs />
    </TasksProvider>
  )
}
