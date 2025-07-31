import { PaymentMethod } from '@/features/paymentmethod/PaymentMethod.type'
import { SaleResponse } from '@/features/sales/Sale.type'

export interface PaymentResponse {
  id: number
  sale: SaleResponse
  paymentMethod: PaymentMethod
  amount: number
  currency: string
  status: PaymentStatus
  transactionId: string
  createdAt: string
  updatedAt: string
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PROCESSING = 'PROCESSING'
}

