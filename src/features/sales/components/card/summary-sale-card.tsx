import { formatDatePPpp } from '@/lib/utils.date'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SaleResponse } from '@/features/sales/Sale.type'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, CreditCard, Percent, User } from 'lucide-react'
import { getPaymentMethodLabel, getStatusBadgeVariant, getStatusLabel } from '@/features/sales/utils/sale.utils'

interface Props {
  sale: SaleResponse
}

const SummarySaleCard = ({ sale }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-3xl font-bold'>
            Summary sale #{sale.id}
          </CardTitle>
          <Badge
            variant={getStatusBadgeVariant(sale.status)}
            className='text-sm'
          >
            {getStatusLabel(sale.status)}
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
                {sale.userVendor.personalInfo?.firstName}
              </p>
              <p className='text-muted-foreground text-xs'>
                {sale.userVendor.email}
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <CreditCard className='text-muted-foreground h-4 w-4' />
            <div>
              <p className='text-muted-foreground text-sm'>Payment method</p>
              <p className='font-medium'>
                {getPaymentMethodLabel(sale.paymentMethod)}
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <CalendarDays className='text-muted-foreground h-4 w-4' />
            <div>
              <p className='text-muted-foreground text-sm'>Creation date</p>
              <p className='font-medium'>
                {formatDatePPpp(sale.createdAt)}
              </p>
            </div>
          </div>

          {sale.discount > 0 && (
            <div className='flex items-center space-x-2'>
              <Percent className='text-muted-foreground h-4 w-4' />
              <div>
                <p className='text-muted-foreground text-sm'>Descuento</p>
                <p className='font-medium'>{sale.discount}%</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SummarySaleCard
