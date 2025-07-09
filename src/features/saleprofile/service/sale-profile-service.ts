import ApiHttpClient from '@/config/ApiHttpClient'
import { PageResponse } from '@/features/api/HttpResponse.type'
import { ProfileResponse } from '@/features/profiles/Profile.type'
import { SaleProfileResponse } from '@/features/saleprofile/SaleProfile.type.ts'
import { SaleProfileCreationDTO, SaleProfileUpdateDTO } from '@/features/sales/Sale.type.ts'

class SaleProfileService {
  private static instance: SaleProfileService

  private constructor() {}

  public static getInstance(): SaleProfileService {
    if (!SaleProfileService.instance) {
      SaleProfileService.instance = new SaleProfileService()
    }
    return SaleProfileService.instance
  }

  private getEndpoint(
    copypointId: number | string,
    saleId: number | string
  ): string {
    return `/copypoints/${copypointId}/sales/${saleId}`
  }

  async getBySaleId(
    copypointId: number,
    saleId: number,
    accessToken: string
  ): Promise<PageResponse<SaleProfileResponse>> {
    const response = await ApiHttpClient.get<PageResponse<SaleProfileResponse>>(
      this.getEndpoint(copypointId, saleId) + '/profiles',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async create(
    copypointId: number | string,
    saleId: number | string,
    accessToken: string,
    data: SaleProfileCreationDTO
  ): Promise<ProfileResponse> {
    const response = await ApiHttpClient.post<ProfileResponse>(
      this.getEndpoint(copypointId, saleId) + '/profiles',
      data,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async update(
    copypointId: number | string,
    saleId: number | string,
    profileId: number | string,
    serviceId: number | string,
    accessToken: string,
    data: SaleProfileUpdateDTO
  ): Promise<ProfileResponse> {
    const response = await ApiHttpClient.patch<ProfileResponse>(
      this.getEndpoint(copypointId, saleId) + '/profiles' + `?profileId=${profileId}&serviceId=${serviceId}`,
      data,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }
}

export default SaleProfileService.getInstance()
