import { cn } from '@/lib/utils'
import { SaleProfileResponse } from '@/features/saleprofile/SaleProfile.type'
import SaleProfileItemDetail from '@/features/saleprofile/components/sale-profile-item-detail'

interface Props {
  saleProfiles: SaleProfileResponse[]
  className?: string
}

const SaleProfileSimpleList = ({ saleProfiles, className }: Props) => {
  return (
    <ul className={cn('space-y-4', className)}>
      {saleProfiles.map((profile) => (
        <li key={profile.saleId + profile.profileId}>
          <SaleProfileItemDetail saleProfile={profile} />
        </li>
      ))}
    </ul>
  )
}

export default SaleProfileSimpleList
