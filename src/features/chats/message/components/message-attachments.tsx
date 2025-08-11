import React from 'react'
import { Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import AttachmentPreview from '../attachment/components/attachment-preview.tsx'
import { Attachment } from '@/features/chats/types/Attachment.type'

interface MessageAttachmentsProps {
  attachments: Attachment[]
  className?: string
  direction?: 'INBOUND' | 'OUTBOUND'
  maxVisible?: number
}

const MessageAttachments: React.FC<MessageAttachmentsProps> = ({
  attachments,
  className,
  direction = 'INBOUND',
  maxVisible = 2, // Reducimos a 2 para disminuir la carga
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  // No renderizar si no hay attachments
  if (!attachments || attachments.length === 0) {
    return null
  }

  // Si hay más attachments de los visibles, mostrar un botón para expandir
  const hasMoreAttachments = attachments.length > maxVisible
  const visibleAttachments = isOpen ? attachments : attachments.slice(0, maxVisible)

  // Función para evitar renderizar todos los attachments a la vez
  const renderAttachments = () => {
    // Solo renderizar los visibles para evitar carga excesiva
    return visibleAttachments.map((attachment) => (
      <AttachmentPreview 
        key={attachment.id} 
        attachmentId={attachment.id} 
        className={cn(
          'max-w-sm',
          direction === 'OUTBOUND' ? 'ml-auto' : 'mr-auto'
        )}
      />
    ))
  }

  return (
    <div className={cn(
      'space-y-2 mt-2',
      direction === 'OUTBOUND' && 'items-end',
      className
    )}>
      {/* Renderizamos los attachments */}
      {renderAttachments()}

      {/* Botón para mostrar más */}
      {hasMoreAttachments && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                'text-xs flex items-center gap-1',
                direction === 'OUTBOUND' ? 'ml-auto' : 'mr-auto'
              )}
            >
              <Paperclip className="h-3 w-3" />
              {isOpen ? 'Ver menos' : `Ver ${attachments.length - maxVisible} más`}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {/* Los attachments adicionales se muestran cuando está abierto */}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

export default MessageAttachments
