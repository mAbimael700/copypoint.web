export type IntegrationSummary = {
  copypointId: number
  copypointName: string
  paymentIntegrations: PaymentIntegration[]
  messagingIntegrations: MessagingIntegration[]
  stats: IntegrationStats
}

export type IntegrationStats = {
  totalIntegrations: number
  activeIntegrations: number
  paymentProvidersCount: number
  messagingProvidersCount: number
}

type Integration = {
  id: number
  providerName: string
  displayName: string
  isActive: boolean
  isConfigurated: boolean
  createdAt: string
  updatedAt: string
}

export type PaymentIntegration = Integration & {
  providerType: string
  clientId: string
  userVendorEmail: string
  isSandbox: boolean
}

export type MessagingIntegration = Integration & {
  providerType: string
  phoneNumber: string
  bussinessAccountId: string
  phoneNumberId: string
}
