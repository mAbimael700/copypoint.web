export type MercadoPagoConfig = {}

export type MercadoPagoConfigCreationRequest = {
  accessToken: string
  publicKey: string
  clientId: string
  clientSecret: string
  isSandbox: boolean
  webhookSecret: string
  vendorEmail: string
}
