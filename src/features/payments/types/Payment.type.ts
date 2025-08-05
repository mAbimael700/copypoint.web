import { SaleResponse } from '@/features/sales/Sale.type'

export interface PaymentResponse {
  id: number
  sale: SaleResponse
  paymentMethod: string
  amount: number
  currency: string
  status: PaymentStatus
  transactionId: string
  createdAt: string
  modifiedAt: string
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',

}
