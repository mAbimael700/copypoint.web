import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/stores/authStore'
import SaleAttachmentService, {
  SaleAttachmentDTO,
} from '@/features/chats/message/attachment/services/SaleAttachmentService.ts'
import { useAttachmentStore } from '@/features/chats/stores/attachment-store.ts'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import useSaleProfiles, {
  profileKeys,
} from '@/features/saleprofile/hooks/useSaleProfiles.ts'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext'

// Keys para el cache de queries de attachments
export const saleAttachmentKeys = {
  all: ['sale-attachments'] as const,
  bySale: (saleId: number | string) =>
    [...saleAttachmentKeys.all, 'sale', saleId || 'none'] as const,
  byProfile: (
    saleId: number | string,
    profileId: number | string,
    serviceId: number | string
  ) =>
    [
      ...saleAttachmentKeys.bySale(saleId),
      'profile',
      profileId,
      'service',
      serviceId,
    ] as const,
  byAttachment: (saleId: number | string, attachmentId: number | string) =>
    [...saleAttachmentKeys.bySale(saleId), 'attachment', attachmentId] as const,
}

export const useSaleAttachment = () => {
  const { accessToken } = useAuth()
  const { currentSale } = useSaleContext()
  const { currentCopypoint } = useCopypointContext()
  const queryClient = useQueryClient()

  // Obtener los perfiles de venta para verificar attachments
  const { saleProfiles = [] } = useSaleProfiles()

  const {
    removeAttachmentFromSale: removeFromStore,
    isAttachmentForSale: isAttachmentForSaleFromStore,
    attachmentsForSale,
  } = useAttachmentStore()

  // Función mejorada para verificar si un attachment está en la venta
  const isAttachmentForSale = (attachmentId: number): boolean => {
    // Verificar primero en los perfiles de venta del backend
    // Si existe en los perfiles de venta, retornar true
    return saleProfiles.some(
      (profile) => profile.attachment && profile.attachment.id === attachmentId
    )
  }

  // Mutation para agregar attachment a venta
  const addAttachmentToSaleMutation = useMutation({
    mutationFn: async ({
      attachmentId,
      saleAttachmentData,
    }: {
      attachmentId: number
      saleAttachmentData: SaleAttachmentDTO
    }) => {
      if (!currentSale?.id || !accessToken) {
        throw new Error('Información de venta no disponible')
      }

      return await SaleAttachmentService.addAttachmentToSale(
        currentSale.id,
        attachmentId,
        saleAttachmentData,
        accessToken
      )
    },
    onSuccess: (_data, variables) => {
      // Actualizar el store local con el attachment
      // Si el store tiene algún método para sincronizar con el backend, llamarlo aquí

      // Invalidar queries relacionadas
      if (currentSale?.id) {
        // Invalidar queries de perfiles de venta
        queryClient.invalidateQueries({
          queryKey: profileKeys.bySale(
            currentCopypoint?.id || 0,
            currentSale.id
          ),
        })

        // Invalidar queries de attachments
        queryClient.invalidateQueries({
          queryKey: saleAttachmentKeys.bySale(currentSale.id),
        })

        // Invalidar la query específica del attachment
        queryClient.invalidateQueries({
          queryKey: saleAttachmentKeys.byAttachment(
            currentSale.id,
            variables.attachmentId
          ),
        })
      }

      toast.success('Attachment agregado exitosamente a la venta')
    },
    onError: (error) => {
      toast.error(
        `Error agregando attachment a la venta: ${error instanceof Error ? error.message : 'Error desconocido'}`
      )
    },
  })

  // Mutation para remover attachment de venta
  const removeAttachmentFromSaleMutation = useMutation({
    mutationFn: async ({
      attachmentId,
      profileId,
      serviceId,
    }: {
      attachmentId: number
      profileId: number
      serviceId: number
    }) => {
      if (!currentSale?.id || !accessToken) {
        throw new Error('Información de venta no disponible')
      }

      const result =
        await SaleAttachmentService.removeAttachmentFromSaleProfile(
          currentSale.id,
          profileId,
          serviceId,
          accessToken
        )

      return { result, attachmentId }
    },
    onSuccess: (data) => {
      // Remover del store local
      removeFromStore(data.attachmentId)

      if (currentSale?.id) {
        // Invalidar queries de perfiles de venta
        queryClient.invalidateQueries({
          queryKey: profileKeys.bySale(
            currentCopypoint?.id || 0,
            currentSale.id
          ),
        })

        // Invalidar queries de attachments
        queryClient.invalidateQueries({
          queryKey: saleAttachmentKeys.bySale(currentSale.id),
        })

        // Invalidar la query específica del attachment
        queryClient.invalidateQueries({
          queryKey: saleAttachmentKeys.byAttachment(
            currentSale.id,
            data.attachmentId
          ),
        })
      }

      toast.success('Attachment removido exitosamente de la venta')
    },
    onError: (error) => {
      toast.error(
        `Error removiendo attachment de la venta: ${error instanceof Error ? error.message : 'Error desconocido'}`
      )
    },
  })

  // Query para obtener attachment de un sale profile específico
  const useAttachmentFromSaleProfile = (
    profileId: number,
    serviceId: number,
    enabled = true
  ) => {
    return useQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: currentSale?.id
        ? saleAttachmentKeys.byProfile(currentSale.id, profileId, serviceId)
        : ['sale-attachment-unavailable'],
      queryFn: async () => {
        if (!currentSale?.id || !accessToken) {
          throw new Error('Información de venta no disponible')
        }

        return await SaleAttachmentService.getAttachmentFromSaleProfile(
          currentSale.id,
          profileId,
          serviceId,
          accessToken
        )
      },
      enabled:
        enabled &&
        !!currentSale?.id &&
        !!accessToken &&
        !!profileId &&
        !!serviceId,
      staleTime: 5 * 60 * 1000, // 5 minutos
    })
  }

  // Función helper para procesar attachment para venta
  const processAttachmentForSale = async (
    attachmentId: number,
    saleAttachmentData: SaleAttachmentDTO
  ) => {
    try {
      // Usar la función mejorada para verificar si el attachment ya está en la venta
      if (isAttachmentForSale(attachmentId)) {
        // Encontrar información del profile que tiene este attachment
        const profileWithAttachment = saleProfiles.find(
          (profile) =>
            profile.attachment && profile.attachment.id === attachmentId
        )

        if (profileWithAttachment) {
          toast.info(
            `Este attachment ya está agregado al perfil "${profileWithAttachment.name}" en la venta actual`
          )
        } else {
          toast.info('Este attachment ya está agregado a la venta actual')
        }

        return false
      } else {
        // Agregar a la venta
        await addAttachmentToSaleMutation.mutateAsync({
          attachmentId,
          saleAttachmentData,
        })
        return true
      }
    } catch (error) {
      // Mostrar error y propagar la excepción
      toast.error(
        `Error procesando attachment: ${error instanceof Error ? error.message : 'Error desconocido'}`
      )
      throw error
    }
  }

  // Hook para obtener todos los attachments de una venta
  const useAllAttachmentsFromSale = (enabled = true) => {
    return useQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: currentSale?.id
        ? saleAttachmentKeys.bySale(currentSale.id)
        : ['sale-attachments-unavailable'],
      queryFn: async () => {
        if (!currentSale?.id || !accessToken) {
          throw new Error('Información de venta no disponible')
        }

        // Esto asume que tienes un endpoint para obtener todos los attachments de una venta
        // Si no existe, puedes adaptar esto para usar los datos del store local
        // return await SaleAttachmentService.getAllAttachmentsFromSale(currentSale.id, accessToken)

        // Por ahora, retornamos los datos del store local
        return attachmentsForSale
      },
      enabled: enabled && !!currentSale?.id && !!accessToken,
      staleTime: 5 * 60 * 1000, // 5 minutos
    })
  }

  return {
    // Mutations
    addAttachmentToSale: addAttachmentToSaleMutation.mutateAsync,
    removeAttachmentFromSale: removeAttachmentFromSaleMutation.mutateAsync,

    // Estados de loading
    isAddingAttachment: addAttachmentToSaleMutation.isPending,
    isRemovingAttachment: removeAttachmentFromSaleMutation.isPending,

    // Errores
    addError: addAttachmentToSaleMutation.error,
    removeError: removeAttachmentFromSaleMutation.error,

    // Store helpers
    isAttachmentForSale,
    isAttachmentForSaleInStore: isAttachmentForSaleFromStore,
    attachmentsForSale,

    // Datos de la venta
    saleProfiles,

    // Funciones helper
    processAttachmentForSale,

    // Custom hooks que se pueden usar en componentes
    useAttachmentFromSaleProfile,
    useAllAttachmentsFromSale,

    // Reset errores
    resetAddError: addAttachmentToSaleMutation.reset,
    resetRemoveError: removeAttachmentFromSaleMutation.reset,
  }
}

export default useSaleAttachment