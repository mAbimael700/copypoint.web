import React from 'react'
import { XIcon, FileIcon, ImageIcon, VideoIcon, AudioIcon, FileTextIcon } from 'lucide-react'
import { useAttachmentStore, useAttachmentActions } from '@/features/chats/stores/attachment-store'
import { useAttachment } from '@/features/chats/hooks/useAttachment'
import { Button } from '@/components/ui/button'

interface AttachmentsListProps {
  showActions?: boolean
  onCheckout?: () => void
}

/**
 * Componente que muestra la lista de attachments seleccionados para venta
 */
const AttachmentsList: React.FC<AttachmentsListProps> = ({ 
  showActions = true,
  onCheckout 
}) => {
  // Obtener attachments del store
  const attachmentsForSale = useAttachmentStore(state => state.attachmentsForSale)
  const clearAttachmentsForSale = useAttachmentStore(state => state.clearAttachmentsForSale)

  const { processAttachmentForSale } = useAttachmentActions()
  const { getReadableFileSize } = useAttachment()

  // Si no hay attachments, mostrar mensaje
  if (attachmentsForSale.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No hay archivos seleccionados para venta
      </div>
    )
  }

  // Renderizar icono según tipo de archivo
  const renderFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />
    if (mimeType.startsWith('video/')) return <VideoIcon className="h-4 w-4" />
    if (mimeType.startsWith('audio/')) return <AudioIcon className="h-4 w-4" />
    if (mimeType.startsWith('application/pdf') || mimeType.includes('document')) 
      return <FileTextIcon className="h-4 w-4" />

    return <FileIcon className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {attachmentsForSale.map(attachment => (
          <div 
            key={attachment.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center gap-2">
              {renderFileIcon(attachment.mimeType)}
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">
                  {attachment.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {getReadableFileSize(attachment.fileSizeBytes)}
                </p>
              </div>
            </div>

            {showActions && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => processAttachmentForSale(attachment)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {showActions && (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => clearAttachmentsForSale()}
          >
            Limpiar todo
          </Button>

          <Button 
            size="sm"
            onClick={onCheckout}
          >
            Procesar venta
          </Button>
        </div>
      )}
    </div>
  )
}

export default AttachmentsList
