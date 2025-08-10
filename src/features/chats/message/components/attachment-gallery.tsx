import React from 'react'
import { DownloadIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import AttachmentPreview from './attachment-preview'
import { Attachment } from '@/features/chats/types/Attachment.type'
import { useAttachment } from '@/features/chats/hooks/useAttachment'

interface AttachmentGalleryProps {
  attachments: Attachment[]
  className?: string
  maxColumns?: number
  maxHeight?: number
}

const AttachmentGallery: React.FC<AttachmentGalleryProps> = ({
  attachments,
  className,
  maxColumns = 3,
  maxHeight = 200,
}) => {
  const [selectedAttachment, setSelectedAttachment] = React.useState<number | null>(null)

  // No renderizar si no hay attachments
  if (!attachments || attachments.length === 0) {
    return null
  }

  // Obtener información del attachment seleccionado
  const selectedAttachmentInfo = selectedAttachment ? 
    useAttachment(selectedAttachment) : null

  // Manejar clic en un attachment
  const handleAttachmentClick = (id: number) => {
    setSelectedAttachment(id)
  }

  // Cerrar el modal
  const handleClose = () => {
    setSelectedAttachment(null)
  }

  // Descargar el attachment seleccionado
  const handleDownload = () => {
    if (selectedAttachment && selectedAttachmentInfo) {
      selectedAttachmentInfo.downloadAndSave(selectedAttachmentInfo.fileName)
    }
  }

  // Determinar el número de columnas basado en la cantidad de attachments
  const columnCount = Math.min(attachments.length, maxColumns)

  return (
    <>
      <div 
        className={cn(
          'grid gap-2',
          `grid-cols-${columnCount}`,
          className
        )}
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {attachments.map((attachment) => (
          <div 
            key={attachment.id} 
            className="cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleAttachmentClick(attachment.id)}
          >
            <AttachmentPreview 
              attachmentId={attachment.id} 
              maxPreviewHeight={maxHeight}
              showControls={false}
            />
          </div>
        ))}
      </div>

      {/* Modal para ver el attachment en detalle */}
      <Dialog open={selectedAttachment !== null} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAttachmentInfo?.fileName || 'Visualizador de archivos'}
            </DialogTitle>
            <DialogDescription>
              {selectedAttachmentInfo?.fileSize || ''}
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 flex justify-center">
            {selectedAttachment && (
              <AttachmentPreview 
                attachmentId={selectedAttachment} 
                maxPreviewHeight={500}
                showControls={false}
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              <XIcon className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
            <Button onClick={handleDownload}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AttachmentGallery
