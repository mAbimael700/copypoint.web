import { Header } from '@/components/layout/header.tsx'
import { Search } from '@/components/search.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { Main } from '@/components/layout/main.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { DataTableSales } from '@/features/sales/components/datatable/data-table-sale.tsx'


const SaleList = () => {
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
            Here&apos;s a list of all copypoints sales!
          </p>
        </div>

        <Separator className='shadow-sm' />


        <div className='py-4'>
          <DataTableSales />
        </div>
      </Main>
    </>
  )
}

export default SaleList