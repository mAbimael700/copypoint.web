import { formatCurrency } from '@/lib/utils.currency'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SaleProfileResponse } from '@/features/saleprofile/SaleProfile.type'

interface Props {
  saleProfiles: SaleProfileResponse[]
}

const SaleprofileResumeTable = ({ saleProfiles }: Props) => {
  return (
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
          <TableRow key={`${profile.saleId}-${profile.profileId}-${index}`}>
            <TableCell>
              <div>
                <p className='font-medium'>{profile.service.name}</p>
                <p className='text-muted-foreground text-sm'>{profile.name}</p>
              </div>
            </TableCell>
            <TableCell>
              <p className='text-sm'>{profile.description}</p>
            </TableCell>
            <TableCell className='text-right'>
              {formatCurrency(profile.unitPrice)}
            </TableCell>
            <TableCell className='text-right'>{profile.quantity}</TableCell>
            <TableCell className='text-right font-medium'>
              {formatCurrency(profile.subtotal)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default SaleprofileResumeTable
