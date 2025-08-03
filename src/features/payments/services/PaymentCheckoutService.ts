import ApiHttpClient from '@/config/ApiHttpClient.ts'
import { PageResponse } from '@/features/api/HttpResponse.type.ts'
import { PaymentResponse } from '../types/Payment.type'

class PaymentCheckoutServiceClass {
  private readonly endpoint = '/payments'


  async getPaymentCheckoutByPayment(
    paymentId: number | string,
    accessToken: string
  ){
    const response = await ApiHttpClient.get<PageResponse<PaymentResponse>>(
      this.endpoint + `/${paymentId}/checkout-data`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }
}

export const PaymentService = new PaymentCheckoutServiceClass()
