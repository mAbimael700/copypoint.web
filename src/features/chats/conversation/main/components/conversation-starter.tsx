import { IconMessages } from '@tabler/icons-react'
import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'

const ConversationStarter = () => {
  return (
    <div
      className={cn(
        'bg-primary-foreground absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex'
      )}
    >
      <div className='flex flex-col items-center space-y-6'>
        <div className='border-border flex size-16 items-center justify-center rounded-full border-2'>
          <IconMessages className='size-8' />
        </div>
        <div className='space-y-2 text-center'>
          <h1 className='text-xl font-semibold'>Your messages</h1>
          <p className='text-muted-foreground text-sm'>
            Send a message to start a chat.
          </p>
        </div>
        <Button className='bg-blue-500 px-6 text-white hover:bg-blue-600'>
          Send message
        </Button>
      </div>
    </div>
  )
}

export default ConversationStarter
