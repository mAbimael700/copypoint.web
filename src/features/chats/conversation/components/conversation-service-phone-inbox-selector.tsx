import { IconMessages } from '@tabler/icons-react'
import CombinedCopypointPhoneSelector from '@/features/chats/components/combined-copypoint-phone-selector.tsx'

const ConversationServicePhoneInboxSelector = () => {
  return (
    <div className={'flex w-full items-center justify-between gap-4'}>
      <div className='flex items-center gap-2'>
        <h1 className='text-2xl font-bold'>Inbox</h1>
        <IconMessages size={20} />
      </div>

      {/* Diálogo para seleccionar copypoint */}
      <CombinedCopypointPhoneSelector />
    </div>
  )
}

export default ConversationServicePhoneInboxSelector
