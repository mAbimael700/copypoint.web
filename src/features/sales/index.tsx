import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTableSalesPending } from './components/datatable/data-table-sale-pending.tsx'



export default function Sales() {

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
            Sales
          </h1>
          <p className='text-muted-foreground'>
            Here&apos;s a list of pending copypoints sales!
          </p>
        </div>

        <Separator className='shadow-sm' />


        <div className='py-4'>
          <DataTableSalesPending />
        </div>
      </Main>
    </>
  )
}
