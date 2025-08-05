import ApiHttpClient from '@/config/ApiHttpClient.ts'
import { PaymentCheckoutData } from '@/features/checkout/types/PaymentCheckoutData.type.ts'

class PaymentCheckoutService {
  private readonly endpoint = '/payments'


  async getPaymentCheckoutByPayment(
    paymentId: number | string,
    accessToken: string
  ){
    const response = await ApiHttpClient.get<PaymentCheckoutData>(
      this.endpoint + `/${paymentId}/checkout-data`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }
}

export const paymentCheckoutService = new PaymentCheckoutService()
