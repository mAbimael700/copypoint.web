import { CustomerContact } from '@/features/chats/types/CustomerContact.type.ts'

export type Conversation = {
  id: number
  createdAt: string
  phoneId: number
  phoneNumber: string
  displayName: string
  contact: CustomerContact
  customerServicePhoneId: number
}
