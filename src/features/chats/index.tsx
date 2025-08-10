import { cn } from '@/lib/utils'
import { Main } from '@/components/layout/main'
import { useConversationContext } from '@/features/chats/context/useConversationContext.ts'
import AsideBody from '@/features/chats/conversation/aside/components/aside-body.tsx'
import ConversationBody from '@/features/chats/conversation/main/components/conversation-body.tsx'
import ConversationHeader from '@/features/chats/conversation/main/components/conversation-header.tsx'
import ConversationStarter from '@/features/chats/conversation/main/components/conversation-starter.tsx'
//import { NewChat } from './components/new-chat'

export default function Chats() {
  const { currentConversation } = useConversationContext()

  return (
    <>
      <Main fixed>
        <section className='flex h-full gap-6'>
          {/* Left Side */}
          <AsideBody />
          {/* Right Side */}
          {currentConversation ? (
            <div
              className={cn(
                'bg-primary-foreground absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col rounded-md border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex',
               // mobileSelectedUser && 'left-0 flex'
              )}
            >
              {/* Top Part */}
              <ConversationHeader />

              {/* Conversation */}
              <ConversationBody />
            </div>
          ) : (
            <ConversationStarter />
          )}
        </section>
        {/*<NewChat
          users={users}
          onOpenChange={setCreateConversationDialog}
          open={createConversationDialogOpened}
        />*/}
      </Main>
    </>
  )
}
