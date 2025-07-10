import { useNavigate } from '@tanstack/react-router'
import { CalendarDays, CreditCard, Percent, User } from 'lucide-react'
import { formatCurrency } from '@/lib/utils.currency.ts'
import { formatDatePPpp } from '@/lib/utils.date.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { Search } from '@/components/search.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import useSaleProfiles from '@/features/saleprofile/hooks/useSaleProfiles.ts'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext.ts'
import {
  getPaymentMethodLabel,
  getStatusBadgeVariant,
  getStatusLabel,
} from '@/features/sales/utils/sale.utils.ts'

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
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-3xl font-bold'>
                Summary sale #{currentSale.id}
              </CardTitle>
              <Badge
                variant={getStatusBadgeVariant(currentSale.status)}
                className='text-sm'
              >
                {getStatusLabel(currentSale.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='flex items-center space-x-2'>
                <User className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-sm'>Vendor</p>
                  <p className='font-medium'>
                    {currentSale.userVendor.personalInfo?.firstName}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {currentSale.userVendor.email}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <CreditCard className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Payment method
                  </p>
                  <p className='font-medium'>
                    {getPaymentMethodLabel(currentSale.paymentMethod)}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <CalendarDays className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground text-sm'>Creation date</p>
                  <p className='font-medium'>
                    {formatDatePPpp(currentSale.createdAt)}
                  </p>
                </div>
              </div>

              {currentSale.discount > 0 && (
                <div className='flex items-center space-x-2'>
                  <Percent className='text-muted-foreground h-4 w-4' />
                  <div>
                    <p className='text-muted-foreground text-sm'>Descuento</p>
                    <p className='font-medium'>{currentSale.discount}%</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Sale profiles</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service profile</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className='text-right'>Unit price</TableHead>
                  <TableHead className='text-right'>Quantity</TableHead>
                  <TableHead className='text-right'>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleProfiles.map((profile, index) => (
                  <TableRow
                    key={`${profile.saleId}-${profile.profileId}-${index}`}
                  >
                    <TableCell>
                      <div>
                        <p className='font-medium'>{profile.service.name}</p>
                        <p className='text-muted-foreground text-sm'>
                          {profile.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className='text-sm'>{profile.description}</p>
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatCurrency(profile.unitPrice)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {profile.quantity}
                    </TableCell>
                    <TableCell className='text-right font-medium'>
                      {formatCurrency(profile.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Payment summary</CardTitle>
            <CardAction>
              <Button onClick={handleAddPayment}>Add payment</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotalBeforeDiscount)}</span>
              </div>

              {currentSale.discount > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Descuento ({currentSale.discount}%):</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <Separator />

              <div className='flex justify-between text-lg font-bold'>
                <span>Total:</span>
                <span>{formatCurrency(currentSale.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
              <div>
                <p className='text-muted-foreground'>Sale ID:</p>
                <p className='font-mono'>#{currentSale.id}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Last update:</p>
                <p>{formatDatePPpp(currentSale.updatedAt)}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Items total:</p>
                <p>{saleProfiles.length} profile(s)</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Quantity Total:</p>
                <p>
                  {saleProfiles.reduce(
                    (sum, profile) => sum + profile.quantity,
                    0
                  )}{' '}
                  unit(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}

export default SaleDetail
