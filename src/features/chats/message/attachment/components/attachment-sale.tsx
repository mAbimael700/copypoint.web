import React from 'react'
import { Button } from '@/components/ui/button.tsx'
import { PlusIcon, CheckIcon } from 'lucide-react'
import { AttachmentResponse } from '@/features/chats/types/Attachment.type.ts'
import { useAttachmentStore, useAttachmentActions } from '@/features/chats/stores/attachment-store'

interface AttachmentAddSaleBtnProps {
  children?: React.ReactNode
  attachment?: AttachmentResponse
}

const AttachmentSale = ({
  attachment,
  children,
}: AttachmentAddSaleBtnProps) => {
  // Usar el store para comprobar si el attachment ya está en la lista de venta
  const isForSale = useAttachmentStore(state => 
    attachment ? state.isAttachmentForSale(attachment.id) : false
  )

  const { processAttachmentForSale } = useAttachmentActions()

  const handleClick = () => {
    if (attachment) {
      processAttachmentForSale(attachment)
    }
  }

  return (
    <>
      {children}
      <Button 
        className={`w-full rounded-sm ${isForSale ? 'bg-green-600 hover:bg-green-700' : ''}`}
        onClick={handleClick}
        disabled={!attachment}
      >
        {isForSale ? (
          <>
            <CheckIcon className="mr-2 h-4 w-4" />
            Added to sale
          </>
        ) : (
          <>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add to sale
          </>
        )}
      </Button>
    </>
  )
}

export default AttachmentSale
