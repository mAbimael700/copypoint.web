import { SaleProfileResponse } from '@/features/saleprofile/SaleProfile.type'
import SaleProfileItemDetail from '@/features/saleprofile/components/sale-profile-item-detail'

interface Props {
  saleProfiles: SaleProfileResponse[]
}

const SaleProfileSimpleList = ({ saleProfiles }: Props) => {
  return (
    <ul>
      {saleProfiles.map((profile) => (
        <SaleProfileItemDetail
          key={profile.saleId + profile.profileId}
          saleProfile={profile}
        />
      ))}
    </ul>
  )
}

export default SaleProfileSimpleList
