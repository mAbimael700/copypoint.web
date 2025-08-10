import { useMemo, useState } from 'react'
import { Attachment } from '@/features/chats/types/Attachment.type'
import { useAttachment } from '@/features/chats/hooks/useAttachment'

/**
 * Hook para gestionar los attachments de un mensaje
 */
export function useMessageAttachments(attachments: Attachment[] = []) {
  const [expandedAttachmentId, setExpandedAttachmentId] = useState<number | null>(null)

  // Agrupar attachments por tipo
  const groupedAttachments = useMemo(() => {
    const grouped = {
      images: [] as Attachment[],
      videos: [] as Attachment[],
      audio: [] as Attachment[],
      documents: [] as Attachment[],
      others: [] as Attachment[],
    }

    attachments.forEach(attachment => {
      const { attachmentInfo, fileType } = useAttachment(attachment.id)

      if (!attachmentInfo) {
        grouped.others.push(attachment)
        return
      }

      switch (fileType) {
        case 'image':
          grouped.images.push(attachment)
          break
        case 'video':
          grouped.videos.push(attachment)
          break
        case 'audio':
          grouped.audio.push(attachment)
          break
        case 'document':
          grouped.documents.push(attachment)
          break
        default:
          grouped.others.push(attachment)
      }
    })

    return grouped
  }, [attachments])

  // Verificar si todos los attachments están disponibles
  const allAvailable = useMemo(() => {
    if (attachments.length === 0) return true

    return attachments.every(attachment => {
      const { isAvailable } = useAttachment(attachment.id)
      return isAvailable
    })
  }, [attachments])

  // Descargar todos los attachments
  const downloadAll = async () => {
    for (const attachment of attachments) {
      const { downloadAndSave, attachmentInfo } = useAttachment(attachment.id)
      await downloadAndSave(attachmentInfo?.originalName)
    }
  }

  return {
    // Datos
    hasAttachments: attachments.length > 0,
    attachmentsCount: attachments.length,
    attachments,
    groupedAttachments,
    allAvailable,

    // Estado de expansión
    expandedAttachmentId,
    setExpandedAttachmentId,
    isExpanded: expandedAttachmentId !== null,
    expandAttachment: (id: number) => setExpandedAttachmentId(id),
    collapseAttachment: () => setExpandedAttachmentId(null),

    // Acciones
    downloadAll,
  }
}
