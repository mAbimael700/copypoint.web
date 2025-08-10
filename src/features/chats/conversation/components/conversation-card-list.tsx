import ConversationCard from '@/features/chats/conversation/components/conversation-card.tsx'
import { useConversationOperations } from '@/features/chats/hooks'

const ConversationCardList = () => {
  const { conversations } = useConversationOperations()
  return conversations.map((conversation) => {
    return (
      <ConversationCard conversation={conversation} key={conversation.id} />
    )
  })
}

export default ConversationCardList
