export type PaymentResponse = {
  success: boolean
  message: string
  checkoutUrl: string
  preferenceId: string
  paymentId: string
  status: string
}

export type PaymentRequest = {
  saleId: number
  description: string
  payer: PayerInfo
  amount: number
  currency: string
}

export type PaymentStatusResponse = {
  paymentId: string
  status: string
  gatewayResponse: string
  amount: number
  currency: string
  errorMessage: string
}

export type PayerInfo = {
  firstName: string
  lastName: string
  email: string
  phone: string
  identification: string
  identificationType: string
}
