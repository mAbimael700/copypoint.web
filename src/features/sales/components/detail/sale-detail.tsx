import { useNavigate } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'

import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { Search } from '@/components/search.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import SaleprofileResumeTable from '@/features/saleprofile/components/table/saleprofile-resume-table'
import useSaleProfiles from '@/features/saleprofile/hooks/useSaleProfiles.ts'
import SummarySaleCard from '@/features/sales/components/card/summary-sale-card'
import SummarySalePayment from '@/features/sales/components/card/summary-sale-payment'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext.ts'
import SaleAdditionalInfo from '@/features/sales/components/card/sale-additional-info'

const SaleDetail = () => {
  const { currentSale } = useSaleContext()
  const { saleProfiles } = useSaleProfiles()
  const navigate = useNavigate()

  if (!currentSale) {
    navigate({ to: '/sales' })
    return null
  }

  const subtotalBeforeDiscount = saleProfiles.reduce(
    (sum, profile) => sum + profile.subtotal,
    0
  )
  const discountAmount = (subtotalBeforeDiscount * currentSale.discount) / 100

  const handleAddPayment = () => {
    navigate({ to: '/sales/detail/add-payment' })
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6 p-6'>
        <SummarySaleCard sale={currentSale} />

        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Sale profiles</CardTitle>
          </CardHeader>

          <CardContent>
            <SaleprofileResumeTable saleProfiles={saleProfiles} />
          </CardContent>
        </Card>

        <SummarySalePayment
          sale={currentSale}
          handleAddPayment={handleAddPayment}
          subtotalBeforeDiscount={subtotalBeforeDiscount}
          discountAmount={discountAmount}
        />

        <SaleAdditionalInfo sale={currentSale} saleProfiles={saleProfiles} />
      </Main>
    </>
  )
}

export default SaleDetail
