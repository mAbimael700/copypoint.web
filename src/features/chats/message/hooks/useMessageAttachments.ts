import { useMemo, useState } from 'react'
import { Attachment } from '@/features/chats/types/Attachment.type'

/**
 * Hook para gestionar los attachments de un mensaje
 */
export function useMessageAttachments(attachments: Attachment[] = []) {
  const [expandedAttachmentId, setExpandedAttachmentId] = useState<number | null>(null)

  // Pre-procesar los attachments para obtener sus tipos
  const attachmentsWithInfo = attachments.map(attachment => {
    // Aquí no usamos hooks, solo pasamos el ID
    return {
      ...attachment,
      id: attachment.id,
    }
  })

  // Agrupar attachments por tipo - sin usar hooks dentro de useMemo
  const groupedAttachments = useMemo(() => {
    const grouped = {
      images: [] as Attachment[],
      videos: [] as Attachment[],
      audio: [] as Attachment[],
      documents: [] as Attachment[],
      others: [] as Attachment[],
    }

    // Clasificamos basado en mimeType o fileType si está disponible en el objeto attachment
    attachmentsWithInfo.forEach(attachment => {
      const mimeType = attachment.mimeType || '';
      const fileType = attachment.fileType || '';

      // Clasificación simple basada en información disponible
      if (mimeType.startsWith('image/') || fileType.includes('image')) {
        grouped.images.push(attachment);
      } else if (mimeType.startsWith('video/') || fileType.includes('video')) {
        grouped.videos.push(attachment);
      } else if (mimeType.startsWith('audio/') || fileType.includes('audio')) {
        grouped.audio.push(attachment);
      } else if (
        mimeType.includes('pdf') ||
        mimeType.includes('word') ||
        mimeType.includes('excel') ||
        mimeType.includes('powerpoint') ||
        mimeType.includes('text/') ||
        fileType.includes('document')
      ) {
        grouped.documents.push(attachment);
      } else {
        grouped.others.push(attachment);
      }
    })

    return grouped
  }, [attachmentsWithInfo])

  // No verificamos la disponibilidad aquí, lo dejamos para los componentes individuales
  const allAvailable = useMemo(() => {
    if (attachments.length === 0) return true

    // La verificación real se hace en los componentes individuales
    // Aquí solo asumimos que están disponibles si tienen la propiedad isAvailable
    return attachments.every(attachment => attachment.isAvailable !== false)
  }, [attachments])

  // Descargar todos los attachments - esta función debe ser usada solo desde componentes
  // que ya tienen acceso a la función downloadAndSave para cada attachment
  const downloadAll = () => {
    return attachments.map(attachment => attachment.id)
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
