import { formatDatePPpp } from '@/lib/utils.date'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SaleProfileResponse } from '@/features/saleprofile/SaleProfile.type'
import { SaleResponse } from '@/features/sales/Sale.type'

interface Props {
  sale: SaleResponse
  saleProfiles: SaleProfileResponse[]
}

const SaleAdditionalInfo = ({ sale, saleProfiles }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-2'>
          <div>
            <p className='text-muted-foreground'>Sale ID:</p>
            <p className='font-mono'>#{sale.id}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Last update:</p>
            <p>{formatDatePPpp(sale.updatedAt)}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Items total:</p>
            <p>{saleProfiles.length} profile(s)</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Quantity Total:</p>
            <p>
              {saleProfiles.reduce((sum, profile) => sum + profile.quantity, 0)}{' '}
              unit(s)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SaleAdditionalInfo
