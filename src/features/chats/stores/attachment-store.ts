import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AttachmentResponse, PresignedUrlResponse } from '@/features/chats/types/Attachment.type'

// Define el tipo para el estado
interface AttachmentState {
  // Estado
  selectedAttachment: AttachmentResponse | null
  attachments: AttachmentResponse[]
  pendingDownloads: number[]
  presignedUrls: Record<number, PresignedUrlResponse>
  attachmentsForSale: AttachmentResponse[]

  // Acciones
  setSelectedAttachment: (attachment: AttachmentResponse | null) => void
  setAttachments: (attachments: AttachmentResponse[]) => void
  addAttachment: (attachment: AttachmentResponse) => void
  removeAttachment: (attachmentId: number) => void
  updateAttachment: (attachmentId: number, data: Partial<AttachmentResponse>) => void
  addPendingDownload: (attachmentId: number) => void
  removePendingDownload: (attachmentId: number) => void
  setPresignedUrl: (attachmentId: number, urlData: PresignedUrlResponse) => void
  clearPresignedUrl: (attachmentId: number) => void
  addAttachmentToSale: (attachment: AttachmentResponse) => void
  removeAttachmentFromSale: (attachmentId: number) => void
  clearAttachmentsForSale: () => void

  // Selectores/Utilidades
  isAttachmentPending: (attachmentId: number) => boolean
  getPresignedUrl: (attachmentId: number) => string | null
  isAttachmentForSale: (attachmentId: number) => boolean
}

// Crea el store usando Zustand con persistencia
export const useAttachmentStore = create<AttachmentState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      selectedAttachment: null,
      attachments: [],
      pendingDownloads: [],
      presignedUrls: {},
      attachmentsForSale: [],

      // Acciones para gestionar attachments
      setSelectedAttachment: (attachment) => set({ selectedAttachment: attachment }),

      setAttachments: (attachments) => set({ attachments }),

      addAttachment: (attachment) => set((state) => ({
        attachments: [...state.attachments, attachment]
      })),

      removeAttachment: (attachmentId) => set((state) => ({
        attachments: state.attachments.filter(a => a.id !== attachmentId)
      })),

      updateAttachment: (attachmentId, data) => set((state) => ({
        attachments: state.attachments.map(attachment =>
          attachment.id === attachmentId
            ? { ...attachment, ...data }
            : attachment
        )
      })),

      // Acciones para descargas pendientes
      addPendingDownload: (attachmentId) => set((state) => ({
        pendingDownloads: [...state.pendingDownloads, attachmentId]
      })),

      removePendingDownload: (attachmentId) => set((state) => ({
        pendingDownloads: state.pendingDownloads.filter(id => id !== attachmentId)
      })),

      // Acciones para URLs firmadas
      setPresignedUrl: (attachmentId, urlData) => set((state) => ({
        presignedUrls: {
          ...state.presignedUrls,
          [attachmentId]: urlData
        }
      })),

      clearPresignedUrl: (attachmentId) => set((state) => {
        const { [attachmentId]: _, ...rest } = state.presignedUrls
        return { presignedUrls: rest }
      }),

      // Acciones para attachments en venta
      addAttachmentToSale: (attachment) => set((state) => {
        // Evitar duplicados
        if (state.attachmentsForSale.some(a => a.id === attachment.id)) {
          return state
        }
        return {
          attachmentsForSale: [...state.attachmentsForSale, attachment]
        }
      }),

      removeAttachmentFromSale: (attachmentId) => set((state) => ({
        attachmentsForSale: state.attachmentsForSale.filter(a => a.id !== attachmentId)
      })),

      clearAttachmentsForSale: () => set({ attachmentsForSale: [] }),

      // Selectores/Utilidades
      isAttachmentPending: (attachmentId) => get().pendingDownloads.includes(attachmentId),

      getPresignedUrl: (attachmentId) => {
        const urlData = get().presignedUrls[attachmentId]
        return urlData ? urlData.presignedUrl : null
      },

      isAttachmentForSale: (attachmentId) => 
        get().attachmentsForSale.some(a => a.id === attachmentId)
    }),
    {
      name: 'attachment-storage', // nombre para el almacenamiento persistente
      partialize: (state) => ({
        // Solo persistir estos datos
        attachmentsForSale: state.attachmentsForSale
      })
    }
  )
)

// Hook personalizado para acciones comunes relacionadas con attachments
export const useAttachmentActions = () => {
  const store = useAttachmentStore()

  // Descarga un attachment
  const downloadAttachment = async (attachment: AttachmentResponse) => {
    try {
      // Marcar como pendiente
      store.addPendingDownload(attachment.id)

      // Simular llamada a API para obtener URL firmada
      // En una implementación real, aquí irían las llamadas a API
      const mockApiCall = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return {
          attachmentId: attachment.id,
          presignedUrl: `https://example.com/download/${attachment.id}`,
          expirationMinutes: 10
        }
      }

      const presignedUrlData = await mockApiCall()
      store.setPresignedUrl(attachment.id, presignedUrlData)

      // Actualizar el estado del attachment
      store.updateAttachment(attachment.id, {
        downloadStatus: 'downloaded',
        dateDownloaded: new Date().toISOString()
      })

      return presignedUrlData.presignedUrl
    } catch (error) {
      console.error('Error downloading attachment:', error)
      throw error
    } finally {
      store.removePendingDownload(attachment.id)
    }
  }

  // Procesar un attachment para venta
  const processAttachmentForSale = (attachment: AttachmentResponse) => {
    if (store.isAttachmentForSale(attachment.id)) {
      store.removeAttachmentFromSale(attachment.id)
      return false // Retorna false si se removió
    } else {
      store.addAttachmentToSale(attachment)
      return true // Retorna true si se agregó
    }
  }

  return {
    downloadAttachment,
    processAttachmentForSale,
    // Exponer otros métodos útiles según sea necesario
  }
}
