import React from 'react'
import { DownloadIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils.ts'

// Función auxiliar para formatear tamaños de archivos
function formatFileSize(bytes?: number): string {
  if (bytes === undefined) return ''
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
import { Button } from '@/components/ui/button.tsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx'
import AttachmentPreview from './attachment-preview.tsx'
import { Attachment } from '@/features/chats/types/Attachment.type.ts'
import { useAttachment } from '@/features/chats/hooks/useAttachment.ts'
import { useAuth } from '@/stores/authStore.ts'
import AttachmentService from '@/features/chats/message/services/AttachmentService.ts'

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
  const { accessToken } = useAuth()
  const [selectedAttachment, setSelectedAttachment] = React.useState<number | null>(null)
  const tempAttachmentId = selectedAttachment || 0
  const attachmentInfo = useAttachment(tempAttachmentId)

  // No renderizar si no hay attachments
  if (!attachments || attachments.length === 0) {
    return null
  }

  // Obtener información del attachment seleccionado - usamos un ID temporal para evitar errores
  // Nota: Esto asegura que useAttachment siempre se llame incondicionalmente

  // Solo usar la información si realmente hay un attachment seleccionado
  const selectedAttachmentInfo = selectedAttachment ? attachmentInfo : null

  // Manejar clic en un attachment
  const handleAttachmentClick = (id: number) => {
    setSelectedAttachment(id)
  }

  // Cerrar el modal
  const handleClose = () => {
    setSelectedAttachment(null)
  }

  // Descargar el attachment seleccionado - implementación manual
  const handleDownload = async () => {
    if (selectedAttachment && selectedAttachmentInfo) {
      try {
        // Implementación manual de descarga usando el servicio directamente

        // Obtener el nombre del archivo desde attachmentInfo
        const fileName = selectedAttachmentInfo.attachmentInfo?.originalName || 'download'

        // Realizar la descarga utilizando el servicio directamente
        await AttachmentService.downloadAndCreateBlobUrl(selectedAttachment, accessToken, fileName)
      } catch (error) {
        console.error('Error al descargar:', error)
      }
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
              {selectedAttachmentInfo?.attachmentInfo?.originalName || 'Visualizador de archivos'}
            </DialogTitle>
            <DialogDescription>
              {selectedAttachmentInfo?.attachmentInfo ? formatFileSize(selectedAttachmentInfo.attachmentInfo.fileSizeBytes) : ''}
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
