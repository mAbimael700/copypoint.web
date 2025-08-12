import { useMessageOperations } from '@/features/chats/hooks'
import MessageBox from '@/features/chats/message/components/message-box.tsx'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MessageList = () => {
  const { messages, isLoading, refetch } = useMessageOperations()

  // Crear una copia del array para no mutar el original
  // y ordenar los mensajes por fecha (asumiendo que tienen una propiedad de fecha)
  // Si no hay una propiedad de fecha, podemos ordenar por el orden en que llegaron
  // usando el array original pero invertido
  const sortedMessages = [...messages]

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Botón de recarga */}
      <div className="flex justify-center mb-4 p-2 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className={cn(
            "transition-all duration-200 hover:scale-105",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
        >
          <RefreshCw 
            className={cn(
              "h-4 w-4 mr-2 transition-transform duration-500",
              isLoading && "animate-spin"
            )} 
          />
          {isLoading ? 'Recargando...' : 'Recargar mensajes'}
        </Button>
      </div>

      {/* Lista de mensajes scrolleable */}
      <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        {sortedMessages.map((message) => {
          return <MessageBox key={message.id} message={message} />
        })}
      </div>
    </div>
  )
}

export default MessageList
