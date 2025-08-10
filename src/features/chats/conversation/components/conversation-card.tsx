import { cn } from '@/lib/utils.ts'
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import { useConversationContext } from '@/features/chats/context/useConversationContext.ts'
import { Conversation } from '@/features/chats/types/Conversation.type.ts'

interface ConversationCardProps {
  conversation: Conversation
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
  const { contact } = conversation
  const { currentConversation, setCurrentConversation } = useConversationContext()
  return (
    <button
      type="button"
      className={cn(
        `hover:bg-secondary/75 -mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm`,
        currentConversation?.id === conversation.id && 'sm:bg-muted'
        )}
      onClick={() => {
        //setSelectedUser(chatUsr)
        setCurrentConversation(conversation)
      }}
    >
      <div className="flex gap-2">
        <Avatar>
          <AvatarFallback>{contact.displayName
            .slice(0, 2)
            .toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <span className="col-start-2 row-span-2 font-medium">
            {contact.displayName}
          </span>
          <span className="text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis">
            {contact.phoneNumber}
          </span>
        </div>
      </div>
    </button>
  )
}

export default ConversationCard
