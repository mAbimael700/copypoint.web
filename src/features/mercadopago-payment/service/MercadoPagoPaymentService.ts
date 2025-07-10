import ApiHttpClient from '@/config/ApiHttpClient.ts'
import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatusResponse,
} from '@/features/mercadopago-payment/types/MercadoPagoPaymentResponse.type.ts'


class MercadoPagoPaymentService {
  private static instance: MercadoPagoPaymentService

  private static readonly endpoint: "/api/payments/mercadopago"
  private constructor() {}

  public static getInstance(): MercadoPagoPaymentService {
    if (!MercadoPagoPaymentService.instance) {
      MercadoPagoPaymentService.instance = new MercadoPagoPaymentService()
    }
    return MercadoPagoPaymentService.instance
  }

  async create(
    accessToken: string,
    data: PaymentRequest
  ): Promise<PaymentResponse> {
    const response = await ApiHttpClient.post<PaymentResponse>(
      MercadoPagoPaymentService.endpoint,
      data,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async getPaymentStatus(
    accessToken: string,
    paymentId: string
  ){
    const response = await ApiHttpClient.get<PaymentStatusResponse>(
      `${MercadoPagoPaymentService.endpoint}/${paymentId}/status`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }
}

export default MercadoPagoPaymentService.getInstance()
