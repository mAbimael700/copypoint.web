import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { useAuth } from '@/stores/authStore'
import { PageResponse } from '@/features/api/HttpResponse.type'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts'
import { useServiceContext } from '@/features/services/context/service-module-context.tsx'
import { ProfileResponse } from '../Profile.type'
import ProfileService from '../services/ProfileService'
import { profileKeys } from './profileKeys'

// Tipos para los parámetros
interface ServicesQueryByCopypointParams {
  copypointId: number
  enabled?: boolean
}

/**
 * Hook para obtener todos los profiles de una copypoint filtrados por servicio
 * Este hook es de solo lectura, no incluye mutaciones
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
 * Hook principal para operaciones de copypoint (solo lectura)
 */
export const useProfileByCopypointOperations = () => {
  const queryClient = useQueryClient()
  const currentService = useServiceContext((state) => state.currentService)
  const { currentCopypoint } = useCopypointContext()

  const profilesQuery = useProfilesByCopypoint({
    copypointId: currentCopypoint?.id || 0,
  })

  const refetch = () => {
    return profilesQuery.refetch()
  }

  const invalidateCache = () => {
    queryClient.invalidateQueries({
      queryKey: profileKeys.byCopypoint(
        currentCopypoint?.id || 0,
        currentService?.id
      ),
    })
  }

  // Estados derivados
  const isLoading = profilesQuery.isLoading
  const isError = profilesQuery.isError
  const isSuccess = profilesQuery.isSuccess
  const data = profilesQuery.data
  const error = profilesQuery.error

  return {
    profiles: data || [],
    isLoading,
    isError,
    isSuccess,
    error,
    refetch,
    invalidateCache,
    query: profilesQuery,
  }
}

// Export por defecto del hook principal
export default useProfileByCopypointOperations
