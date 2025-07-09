import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/stores/authStore'
import { ProfileResponse } from '@/features/profiles/Profile.type'
import { SaleProfileCreationDTO, SaleProfileUpdateDTO } from '@/features/sales/Sale.type'
import SaleProfileService from '../service/sale-profile-service'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext'
import { saleKeys } from '@/features/sales/hooks/useSales'

// Keys para el cache de queries
export const saleProfileKeys = {
  all: ['sale-profiles'] as const,
  bySale: (copypointId: number | string, saleId: number | string) =>
    [
      ...saleProfileKeys.all,
      'copypoint',
      copypointId,
      'sale',
      saleId || 'none',
    ] as const,
  detail: (
    copypointId: number | string,
    saleId: number | string,
    profileId: number | string
  ) =>
    [...saleProfileKeys.bySale(copypointId, saleId), 'detail', profileId] as const,
}

interface CreateSaleProfileParams {
  copypointId: number | string
  saleId: number | string
  data: SaleProfileCreationDTO
}

interface UpdateSaleProfileParams {
  copypointId: number | string
  saleId: number | string
  profileId: number | string
  serviceId: number | string
  data: SaleProfileUpdateDTO
}

/**
 * Hook para crear un perfil de venta
 */
export const useCreateSaleProfile = (
  options?: UseMutationOptions<ProfileResponse, Error, CreateSaleProfileParams>
) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (params: CreateSaleProfileParams): Promise<ProfileResponse> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      return await SaleProfileService.create(
        params.copypointId,
        params.saleId,
        accessToken,
        params.data
      )
    },
    onSuccess: (_, variables) => {
      // Invalidar caché para la venta actual
      queryClient.invalidateQueries({
        queryKey: saleProfileKeys.bySale(variables.copypointId, variables.saleId),
      })

      // Invalidar caché de ventas para que se actualice la lista
      queryClient.invalidateQueries({
        queryKey: saleKeys.byCopypoint(variables.copypointId),
      })

      queryClient.invalidateQueries({
        queryKey: saleKeys.detail(variables.copypointId, variables.saleId),
      })

      //toast.success('Perfil agregado a la venta correctamente')
    },
    onError: (error) => {
      toast.error(`Error al agregar perfil a la venta: ${error.message}`)
    },
    ...options,
  })
}


/**
 * Hook para crear un perfil de venta
 */
export const useUpdateSaleProfile = (
  options?: UseMutationOptions<ProfileResponse, Error, UpdateSaleProfileParams>
) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (params: UpdateSaleProfileParams): Promise<ProfileResponse> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      return await SaleProfileService.update(
        params.copypointId,
        params.saleId,
        params.profileId,
        params.serviceId,
        accessToken,
        params.data
      )
    },
    onSuccess: (_, variables) => {
      // Invalidar caché para la venta actual
      queryClient.invalidateQueries({
        queryKey: saleProfileKeys.bySale(variables.copypointId, variables.saleId),
      })

      // Invalidar caché de ventas para que se actualice la lista
      queryClient.invalidateQueries({
        queryKey: saleKeys.byCopypoint(variables.copypointId),
      })

      queryClient.invalidateQueries({
        queryKey: saleKeys.detail(variables.copypointId, variables.saleId),
      })

      //toast.success('Perfil agregado a la venta correctamente')
    },
    onError: (error) => {
      toast.error(`Error al agregar perfil a la venta: ${error.message}`)
    },
    ...options,
  })
}


/**
 * Hook principal para gestionar los perfiles de venta
 */
const useCreateSaleProfileOperations = () => {
  const { currentCopypoint } = useCopypointContext()
  const { currentSale } = useSaleContext()
  const queryClient = useQueryClient()
  const createMutation = useCreateSaleProfile()
  const updateMutation = useUpdateSaleProfile()

  // Función para crear perfil de venta
  const createSaleProfile = (data: SaleProfileCreationDTO) => {
    if (!currentCopypoint?.id) {
      toast.error('No hay un copypoint seleccionado')
      return Promise.reject(new Error('No hay un copypoint seleccionado'))
    }

    if (!currentSale?.id) {
      toast.error('No hay una venta seleccionada')
      return Promise.reject(new Error('No hay una venta seleccionada'))
    }

    return createMutation.mutateAsync({
      copypointId: currentCopypoint.id,
      saleId: currentSale.id,
      data,
    })
  }

  // Función para actualizar perfil de venta
  const updateSaleProfile = (profileId: number, serviceId: number, data: SaleProfileUpdateDTO) => {
    if (!currentCopypoint?.id) {
      toast.error('No hay un copypoint seleccionado')
      return Promise.reject(new Error('No hay un copypoint seleccionado'))
    }

    if (!currentSale?.id) {
      toast.error('No hay una venta seleccionada')
      return Promise.reject(new Error('No hay una venta seleccionada'))
    }

    return updateMutation.mutateAsync({
      copypointId: currentCopypoint.id,
      saleId: currentSale.id,
      profileId,
      serviceId,
      data,
    })
  }

  // Función para refrescar los datos de ventas manualmente
  const refetchSales = () => {
    if (!currentCopypoint?.id || !currentSale?.id) return Promise.resolve()

    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: saleKeys.byCopypoint(currentCopypoint.id),
      }),
      queryClient.invalidateQueries({
        queryKey: saleKeys.detail(currentCopypoint.id, currentSale.id),
      }),
    ])
  }

  return {
    createSaleProfile,
    updateSaleProfile,
    isCreating: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error || updateMutation.error,
    refetchSales,
  }
}

export default useCreateSaleProfileOperations
