import { AttachmentResponse } from '@/features/chats/types/Attachment.type.ts'

export interface SaleProfileResponse {
  saleId: number
  profileId: number
  service: {
    id: number
    name: string
  }
  name: string
  description: string
  unitPrice: number
  quantity: number
  subtotal: number
  attachment: AttachmentResponse
}
