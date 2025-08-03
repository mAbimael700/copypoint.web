import ApiHttpClient from '@/config/ApiHttpClient.ts'
import {
  MercadoPagoConfig,
  MercadoPagoConfigCreationRequest,
} from '@/features/mercadopago-config/types/MercadoPagoConfig.type.ts'

class MercadoPagoConfigService {
  async createMercadoPagoConfig(
    copypointId: number | string,
    accessToken: string,
    data: MercadoPagoConfigCreationRequest
  ): Promise<MercadoPagoConfig> {
    const response = await ApiHttpClient.post<MercadoPagoConfig>(
      `/copypoints/${copypointId}/mercadopago-config`,
      data,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async getByCopypoint(
    copypointId: number | string,
    accessToken: string
  ): Promise<MercadoPagoConfig[]> {
    const response = await ApiHttpClient.get<MercadoPagoConfig[]>(
      `/copypoints/${copypointId}/mercadopago-config`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async generateMPToken(accessToken: string): Promise<string> {
    const response = await ApiHttpClient.get<string>(
      '/mercadopago-config/generate-token',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }
}

export const PaymentService = new MercadoPagoConfigService()
