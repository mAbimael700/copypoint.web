import { useMessageOperations } from '@/features/chats/hooks'
import MessageBox from '@/features/chats/message/components/message-box.tsx'

const MessageList = () => {
  const { messages } = useMessageOperations()

  // Crear una copia del array para no mutar el original
  // y ordenar los mensajes por fecha (asumiendo que tienen una propiedad de fecha)
  // Si no hay una propiedad de fecha, podemos ordenar por el orden en que llegaron
  // usando el array original pero invertido
  const sortedMessages = [...messages].reverse()

  return sortedMessages.map((message) => {
    return <MessageBox key={message.id} message={message} />
  })
}

export default MessageList
