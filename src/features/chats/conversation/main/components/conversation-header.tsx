import {
  IconArrowLeft,
  IconDotsVertical,
  IconPhone,
  IconVideo,
} from '@tabler/icons-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useConversationContext } from '@/features/chats/context/useConversationContext.ts'

const ConversationHeader = () => {
  const { currentConversation } = useConversationContext()

  return (
    <div className='mb-1 flex flex-none justify-between rounded-t-md p-4 shadow'>
      {/* Left */}
      <div className='flex gap-3'>
        <Button size='icon' variant='ghost' className='-ml-2 h-full sm:hidden'>
          <IconArrowLeft />
        </Button>
        <div className='flex items-center gap-2 lg:gap-4'>
          <Avatar className='size-9 lg:size-11'>
            <AvatarImage />
            <AvatarFallback>
              {currentConversation?.contact.displayName
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
              {currentConversation?.contact.displayName}
            </span>
            <span className='text-sm text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis'>
              {currentConversation?.contact.phoneNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
        <Button
          size='icon'
          variant='ghost'
          className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
        >
          <IconVideo size={22} className='stroke-muted-foreground' />
        </Button>
        <Button
          size='icon'
          variant='ghost'
          className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
        >
          <IconPhone size={22} className='stroke-muted-foreground' />
        </Button>
        <Button
          size='icon'
          variant='ghost'
          className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
        >
          <IconDotsVertical className='stroke-muted-foreground sm:size-5' />
        </Button>
      </div>
    </div>
  )
}

export default ConversationHeader
