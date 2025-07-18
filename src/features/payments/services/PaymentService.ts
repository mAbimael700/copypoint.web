import ApiHttpClient from '@/config/ApiHttpClient.ts'
import { PageResponse } from '@/features/api/HttpResponse.type.ts'
import { PaymentResponse } from '../types/Payment.type'

class PaymentServiceClass {
  private readonly endpoint = '/payments'

  async getPayments(
    copypointId: number | string,
    accessToken: string
  ): Promise<PageResponse<PaymentResponse>> {
    const response = await ApiHttpClient.get<PageResponse<PaymentResponse>>(
      this.endpoint + `?copypointId=${copypointId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }
}

export const PaymentService = new PaymentServiceClass()
