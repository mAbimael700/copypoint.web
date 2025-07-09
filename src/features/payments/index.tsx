

import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTablePayments } from './components/datatable/data-table-payments'


const Payments = () => {
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
          <h1 className='text-2xl font-bold tracking-tight'>
            Payments
          </h1>
          <p className='text-muted-foreground'>
            Here&apos;s a list of copypoint sale payments!
          </p>
        </div>

        <Separator className='shadow-sm' />

        <div className='py-4'>
          <DataTablePayments />
        </div>
      </Main>
    </>
  )
}

export default Payments