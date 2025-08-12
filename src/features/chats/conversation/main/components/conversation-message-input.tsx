import { Button } from '@/components/ui/button.tsx'
import { IconPaperclip, IconPhotoPlus, IconPlus, IconSend } from '@tabler/icons-react'


const ConversationMessageInput = () => {
  return (
    <form className='flex w-full flex-none gap-2'>
      <div className='border-input focus-within:ring-ring flex flex-1 items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4'>
        <div className='space-x-1'>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='h-8 rounded-md'
          >
            <IconPlus size={20} className='stroke-muted-foreground' />
          </Button>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='hidden h-8 rounded-md lg:inline-flex'
          >
            <IconPhotoPlus size={20} className='stroke-muted-foreground' />
          </Button>
          <Button
            size='icon'
            type='button'
            variant='ghost'
            className='hidden h-8 rounded-md lg:inline-flex'
          >
            <IconPaperclip size={20} className='stroke-muted-foreground' />
          </Button>
        </div>
        <label className='flex-1'>
          <span className='sr-only'>Chat Text Box</span>
          <input
            type='text'
            disabled
            placeholder='Type your messages...'
            className='h-8 w-full bg-inherit focus-visible:outline-hidden'
          />
        </label>
        <Button variant='ghost' size='icon' className='hidden sm:inline-flex'>
          <IconSend size={20} />
        </Button>
      </div>
      <Button className='h-full sm:hidden'>
        <IconSend size={18} /> Send
      </Button>
    </form>
  )
}

export default ConversationMessageInput