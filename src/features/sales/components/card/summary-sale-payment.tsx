import { formatCurrency } from '@/lib/utils.currency'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SaleResponse } from '@/features/sales/Sale.type'

interface Props {
  sale: SaleResponse
  handleAddPayment: () => void
  subtotalBeforeDiscount: number
  discountAmount: number
}

const SummarySalePayment = ({
  sale,
  handleAddPayment,
  subtotalBeforeDiscount,
  discountAmount,
}: Props) => {
  return (
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

          {sale.discount > 0 && (
            <div className='flex justify-between text-green-600'>
              <span>Descuento ({sale.discount}%):</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <Separator />

          <div className='flex justify-between text-lg font-bold'>
            <span>Total:</span>
            <span>{formatCurrency(sale.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SummarySalePayment
