import { IconEdit, IconSearch } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import ConversationCardList from '@/features/chats/conversation/components/conversation-card-list.tsx'
import ConversationServicePhoneInboxSelector from '@/features/chats/conversation/components/conversation-service-phone-inbox-selector.tsx'

const AsideBody = () => {
  return (
    <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
      <div className='bg-background sticky top-0 z-10 -mx-4 px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
        <div className='flex items-center justify-between py-2'>
          <div className='flex gap-2'>
            <ConversationServicePhoneInboxSelector />
          </div>

          <Button size='icon' variant='ghost' className='rounded-lg'>
            <IconEdit size={24} className='stroke-muted-foreground' />
          </Button>
        </div>

        <label className='border-input focus-within:ring-ring flex h-8 w-full items-center space-x-0 rounded-md border pl-2 focus-within:ring-1 focus-within:outline-hidden'>
          <IconSearch size={15} className='mr-2 stroke-slate-500' />
          <span className='sr-only'>Search</span>
          <input
            type='text'
            className='w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden'
            placeholder='Search chat...'
          />
        </label>
      </div>

      <ScrollArea className='-mx-3 h-full p-3'>
        <ConversationCardList />
      </ScrollArea>
    </div>
  )
}

export default AsideBody
