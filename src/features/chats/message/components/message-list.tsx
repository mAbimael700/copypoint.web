import { useMessageOperations } from '@/features/chats/hooks'
import MessageBox from '@/features/chats/message/components/message-box.tsx'

const MessageList = () => {
  const { messages } = useMessageOperations()
  return messages.map((message) => {
    return <MessageBox message={message} />
  })
}

export default MessageList
