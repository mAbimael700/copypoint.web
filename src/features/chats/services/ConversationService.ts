import ApiHttpClient from '@/config/ApiHttpClient.ts'
import { PageResponse } from '@/features/api/HttpResponse.type.ts'
import { Conversation } from '@/features/chats/types/Conversation.type.ts'

class ConversationService {
  private static instance: ConversationService

  private constructor() {}

  public static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService()
    }
    return ConversationService.instance
  }

  async getByCustomerPhoneService(
    phoneId: number | string,
    accessToken: string
  ): Promise<PageResponse<Conversation>> {
    const response = await ApiHttpClient.get<PageResponse<Conversation>>(
      `/conversations/phone/${phoneId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

}

export default ConversationService.getInstance()
