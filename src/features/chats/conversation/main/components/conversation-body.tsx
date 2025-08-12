import Background from '@/assets/chats/background.png'
import ConversationMessageInput from '@/features/chats/conversation/main/components/conversation-message-input.tsx'
import MessageList from '@/features/chats/message/components/message-list.tsx'
import SaleFloatingPanel from '@/features/chats/conversation/main/components/sale-floating-panel.tsx'

const ConversationBody = () => {
  return (
    <div className="relative flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4">
      {/* Overlay con opacidad */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-md"
        style={{
          backgroundImage: `url(${Background})`,
          opacity: 0.2, // opacidad solo para el fondo
        }}
      ></div>

      {/* Contenido encima */}
      {/* Panel flotante para gestión de ventas */}
      <SaleFloatingPanel />
      <div className="relative flex size-full flex-1">
        <div className="chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden">
          <div className="chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pr-4 pb-4">
            <MessageList />
          </div>
        </div>
      </div>

      <ConversationMessageInput />
    </div>
  )
}

export default ConversationBody
