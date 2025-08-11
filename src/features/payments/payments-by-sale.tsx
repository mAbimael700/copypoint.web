import { useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTablePaymentsBySale } from '@/features/payments/components/datatable/data-table-payments-by-sale.tsx'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext.ts'

const PaymentsBySale = () => {
  const { currentSale } = useSaleContext()
  const { navigate } = useRouter()

  if (!currentSale) {
    navigate({ to: '/payments' })
    return null
  }

  const handleAddPayment = () => {
    navigate({ to: '/sales/detail/add-payment' })
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
        <div className={'flex gap-4 justify-between items-center pb-2'}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
            <p className="text-muted-foreground">
              Here&apos;s a list of sale #{currentSale.id} payments!
            </p>
          </div>
          <Button onClick={handleAddPayment}>Add payment</Button>
        </div>

        <Separator className='shadow-sm' />

        <div className='py-4'>
          <DataTablePaymentsBySale />
        </div>
      </Main>
    </>
  )
}

export default PaymentsBySale
