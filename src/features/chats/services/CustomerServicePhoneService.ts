import ApiHttpClient from '@/config/ApiHttpClient.ts'
import {
  CustomerServicePhone,
  CustomerServicePhoneCreationDTO,
} from '@/features/chats/types/CustomerServicePhone.type.ts'
import { PageResponse } from '@/features/api/HttpResponse.type.ts'

class CustomerServicePhoneService {
  private static instance: CustomerServicePhoneService

  private constructor() {}

  public static getInstance(): CustomerServicePhoneService {
    if (!CustomerServicePhoneService.instance) {
      CustomerServicePhoneService.instance = new CustomerServicePhoneService()
    }
    return CustomerServicePhoneService.instance
  }

  async getByCopypoint(
    copypointId: number | string,
    accessToken: string
  ): Promise<PageResponse<CustomerServicePhone>> {
    const response = await ApiHttpClient.get<PageResponse<CustomerServicePhone>>(
      `/copypoints/${copypointId}/phones`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async create(
    copypointId: number | string,
    accessToken: string,
    data: CustomerServicePhoneCreationDTO
  ): Promise<CustomerServicePhone> {
    const response = await ApiHttpClient.post<CustomerServicePhone>(
      `/copypoints/${copypointId}/phones`,
      data,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }
}

export default CustomerServicePhoneService.getInstance()
