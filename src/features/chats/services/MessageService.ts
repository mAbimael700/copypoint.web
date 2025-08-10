import ApiHttpClient from '@/config/ApiHttpClient.ts'
import { PageResponse } from '@/features/api/HttpResponse.type.ts'
import { Message } from '@/features/chats/types/Message.type.ts'

class MessageService {
  private static instance: MessageService

  private constructor() {}

  public static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService()
    }
    return MessageService.instance
  }

  async getByConversation(
    conversationId: number | string,
    accessToken: string
  ): Promise<PageResponse<Message>> {
    const response = await ApiHttpClient.get<PageResponse<Message>>(
      `/messages/conversation/${conversationId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.data
  }

}

export default MessageService.getInstance()
