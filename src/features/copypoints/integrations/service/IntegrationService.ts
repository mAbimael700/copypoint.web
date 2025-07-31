import ApiHttpClient from '@/config/ApiHttpClient.ts';
import {
  IntegrationStats,
  IntegrationSummary,
  MessagingIntegration,
  PaymentIntegration,
} from '@/features/copypoints/integrations/types/integration.type.ts'

class IntegrationService {
  private static instance: IntegrationService

  private constructor() {}

  public static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService()
    }
    return IntegrationService.instance
  }

  async getByCopypoint(
    copypointId: number | string,
    accessToken: string
  ): Promise<IntegrationSummary> {
    const response = await ApiHttpClient.get<IntegrationSummary>(
      `/copypoints/${copypointId}/integrations`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async getPaymentIntegrationsByCopypoint(
    copypointId: number | string,
    accessToken: string
  ): Promise<PaymentIntegration> {
    const response = await ApiHttpClient.get<PaymentIntegration>(
      `/copypoints/${copypointId}/integrations/payment`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async getMessagingIntegrationsByCopypoint(
    copypointId: number | string,
    accessToken: string
  ): Promise<MessagingIntegration> {
    const response = await ApiHttpClient.get<MessagingIntegration>(
      `/copypoints/${copypointId}/integrations/messaging`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async getStatsByCopypoint(
    copypointId: number | string,
    accessToken: string
  ): Promise<IntegrationStats> {
    const response = await ApiHttpClient.get<IntegrationStats>(
      `/copypoints/${copypointId}/integrations/stats`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

  async hasActiveIntegrations(
    copypointId: number | string,
    accessToken: string
  ): Promise<IntegrationStats> {
    const response = await ApiHttpClient.get<IntegrationStats>(
      `/copypoints/${copypointId}/integrations/status`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }


}

export default IntegrationService.getInstance()
