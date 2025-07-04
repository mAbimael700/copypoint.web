import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/stores/authStore'
import { PageResponse } from '@/features/api/HttpResponse.type'
import { useServiceContext } from '@/features/services/context/service-module-context.tsx'
import { ProfileResponse, ProfileCreationDTO } from '../Profile.type'
import ProfileService from '../services/ProfileService'
import { useProfileStore } from '@/features/profiles/context/ProfileStore'

// Cambiado de useProfileModule

// Tipos para los parámetros
interface ServicesQueryByStoreParams {
  storeId: number | string
  enabled?: boolean
}

interface ServicesQueryByCopypointParams {
  copypointId: number
  enabled?: boolean
}


interface CreateServiceParams {
  storeId: number | string
  data: ProfileCreationDTO
}

// Keys para el cache de queries - ACTUALIZADO para incluir serviceId
export const profileKeys = {
  all: ['profiles'] as const,
  byStore: (storeId: number | string, serviceId?: number | string) =>
    [
      ...profileKeys.all,
      'store',
      storeId,
      'service',
      serviceId || 'none',
    ] as const,
  byCopypoint: (copypointId: number | string, serviceId?: number | string) =>
    [
      ...profileKeys.all,
      'copypoint',
      copypointId,
      'service',
      serviceId || 'none',
    ] as const,
  detail: (
    storeId: number | string,
    serviceId: number | string,
    id: number | string
  ) => [...profileKeys.byStore(storeId, serviceId), 'detail', id] as const,
}

/**
 * Hook para obtener todos los profiles de una tienda filtrados por servicio
 */
export const useProfilesByStore = (
  params: ServicesQueryByStoreParams,
  options?: Omit<
    UseQueryOptions<PageResponse<ProfileResponse>>,
    'queryKey' | 'queryFn'
  >
) => {
  const { accessToken, isAuthenticated } = useAuth()
  const currentService = useProfileStore((state) => state.currentService) // Usar selector específico

  return useQuery({
    // La queryKey ahora incluye el serviceId para que se actualice automáticamente
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: profileKeys.byStore(params.storeId, currentService?.id),
    queryFn: async (): Promise<PageResponse<ProfileResponse>> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      return await ProfileService.getAllByServiceId(
        params.storeId,
        currentService?.id || 0,
        accessToken
      )
    },
    enabled:
      isAuthenticated() &&
      !!params.storeId &&
      !!currentService?.id && // Solo ejecutar si hay un servicio seleccionado
      (params.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      // No reintentar si es error de autorización
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false
      }
      return failureCount < 3
    },
    ...options,
  })
}

/**
 * Hook para obtener todos los profiles de una copypoint filtrados por servicio
 */
export const useProfilesByCopypoint = (
  params: ServicesQueryByCopypointParams,
  options?: Omit<
    UseQueryOptions<PageResponse<ProfileResponse>>,
    'queryKey' | 'queryFn'
  >
) => {
  const { accessToken, isAuthenticated } = useAuth()
  const currentService = useServiceContext((state) => state.currentService) // Usar selector específico

  const query = useQuery({
    // La queryKey ahora incluye el serviceId para que se actualice automáticamente
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: profileKeys.byCopypoint(params.copypointId, currentService?.id),
    queryFn: async (): Promise<PageResponse<ProfileResponse>> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      return await ProfileService.getByServiceId(
        params.copypointId,
        currentService?.id || 0,
        accessToken
      )
    },
    enabled:
      isAuthenticated() &&
      !!params.copypointId &&
      !!currentService?.id && // Solo ejecutar si hay un servicio seleccionado
      (params.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      // No reintentar si es error de autorización
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false
      }
      return failureCount < 3
    },
    ...options,
  })

  // Return only the specific properties you need instead of spreading the entire query
  return {
    data: query.data?.content,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}
/**
 * Hook para crear un nuevo profile
 */
export const useCreateProfile = (
  options?: UseMutationOptions<ProfileResponse, Error, CreateServiceParams>
) => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()
  const currentService = useProfileStore((state) => state.currentService)

  return useMutation({
    mutationFn: async (
      params: CreateServiceParams
    ): Promise<ProfileResponse> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      return await ProfileService.create(
        params.storeId,
        accessToken,
        params.data
      )
    },
    onSuccess: (data, variables) => {
      // Invalidar cache para el servicio actual
      queryClient.invalidateQueries({
        queryKey: profileKeys.byStore(variables.storeId, currentService?.id),
      })

      // Actualizar cache optimísticamente
      queryClient.setQueryData<PageResponse<ProfileResponse>>(
        profileKeys.byStore(variables.storeId, currentService?.id),
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            content: [data, ...oldData.content],
            totalElements: oldData.totalElements + 1,
          }
        }
      )

      toast.success('Service profile created successfully')
    },
    onError: (error) => {
      toast.error(`Error creating service profile: ${error.message}`)
    },
    ...options,
  })
}

/**
 * Hook principal que agrupa todas las funcionalidades
 */
export const useProfileOperations = (storeId: number | string) => {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const currentService = useProfileStore((state) => state.currentService)

  // Query para obtener profiles
  const profilesQuery = useProfilesByStore({
    storeId,
    enabled: !!storeId && isAuthenticated() && !!currentService?.id,
  })

  // Mutation para crear
  const createMutation = useCreateProfile()

  // Función para refrescar datos
  const refetch = () => {
    return profilesQuery.refetch()
  }

  // Función para invalidar cache del servicio actual
  const invalidateCache = () => {
    queryClient.invalidateQueries({
      queryKey: profileKeys.byStore(storeId, currentService?.id),
    })
  }

  // Función para crear profile
  const createProfile = (data: ProfileCreationDTO) => {
    return createMutation.mutateAsync({ storeId, data })
  }

  // Estados derivados
  const isLoading = profilesQuery.isLoading
  const isError = profilesQuery.isError
  const isSuccess = profilesQuery.isSuccess
  const data = profilesQuery.data
  const error = profilesQuery.error

  // Estados de mutación
  const isCreating = createMutation.isPending
  const createError = createMutation.error

  return {
    // Datos
    profiles: data?.content || [],
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,

    // Estados de query
    isLoading,
    isError,
    isSuccess,
    error,

    // Estados de mutación
    isCreating,
    createError,

    // Funciones
    createProfile, // Renombrado para mayor claridad
    refetch,
    invalidateCache,

    // Query original (por si necesitas acceso completo)
    query: profilesQuery,
    createMutation,
  }
}

/**
 * Hook para prefetch de profiles (útil para optimizaciones)
 */
export const usePrefetchProfiles = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()
  const currentService = useProfileStore((state) => state.currentService)

  const prefetchProfiles = async (storeId: number | string) => {
    if (!accessToken || !currentService?.id) return

    await queryClient.prefetchQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: profileKeys.byStore(storeId, currentService.id),
      queryFn: () =>
        ProfileService.getAllByServiceId(
          storeId,
          currentService.id,
          accessToken
        ),
      staleTime: 5 * 60 * 1000,
    })
  }

  return { prefetchProfiles }
}

// Export por defecto del hook principal
export default useProfileOperations
