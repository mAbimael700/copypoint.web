
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useAuth } from '@/stores/authStore.ts'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts'
import { CustomerServicePhone, CustomerServicePhoneCreationDTO } from '@/features/chats/types/CustomerServicePhone.type.ts'
import CustomerServicePhoneService from '@/features/chats/services/CustomerServicePhoneService.ts'
import { toast } from 'sonner'
import { PageResponse } from '@/features/api/HttpResponse.type.ts'

// Keys para el query cache
export const customerServicePhoneKeys = {
  all: ['customer-service-phones'] as const,
  byCopypoint: (copypointId: number | string) =>
    [...customerServicePhoneKeys.all, 'copypoint', copypointId] as const,
}

// Parámetros para las queries
interface CustomerServicePhoneQueryParams {
  copypointId?: number | string
  enabled?: boolean
}

// Hook para obtener los teléfonos de atención al cliente por copypoint
export const useCustomerServicePhonesByCopypoint = (
  params: CustomerServicePhoneQueryParams,
  options?: Omit<
    UseQueryOptions<PageResponse<CustomerServicePhone>>,
    'queryKey' | 'queryFn'
  >
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: customerServicePhoneKeys.byCopypoint(params.copypointId || 0),
    queryFn: async (): Promise<PageResponse<CustomerServicePhone>> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      if (!params.copypointId) {
        throw new Error('Copypoint ID no disponible')
      }
      return await CustomerServicePhoneService.getByCopypoint(
        params.copypointId,
        accessToken
      )
    },
    enabled:
      isAuthenticated() &&
      !!params.copypointId &&
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

// Hook para crear un teléfono de atención al cliente
export const useCreateCustomerServicePhone = () => {
  const { accessToken, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      copypointId,
      data,
    }: {
      copypointId: number | string
      data: CustomerServicePhoneCreationDTO
    }): Promise<CustomerServicePhone> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      if (!isAuthenticated()) {
        throw new Error('Usuario no autenticado')
      }
      return await CustomerServicePhoneService.create(copypointId, accessToken, data)
    },
    onSuccess: (newPhone, variables) => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({
        queryKey: customerServicePhoneKeys.byCopypoint(variables.copypointId)
      })

      // También podemos actualizar el cache directamente si es necesario
      queryClient.setQueryData<PageResponse<CustomerServicePhone> | undefined>(
        customerServicePhoneKeys.byCopypoint(variables.copypointId),
        (oldData) => {
          if (!oldData) return undefined

          return {
            ...oldData,
            content: [newPhone, ...oldData.content],
            totalElements: oldData.totalElements + 1,
            numberOfElements: oldData.numberOfElements + 1
          }
        }
      )

      toast.success('Teléfono de atención al cliente creado exitosamente')
    },
    onError: (error: any) => {
      console.error('Error creating customer service phone:', error)
      toast.error('Error al crear el teléfono de atención al cliente')
    },
  })
}

// Hook principal que usa el contexto de copypoint
export default function useCustomerServicePhone() {
  const { currentCopypoint } = useCopypointContext()

  const query = useCustomerServicePhonesByCopypoint({
    copypointId: currentCopypoint?.id || 0,
    enabled: !!currentCopypoint?.id,
  })

  const createMutation = useCreateCustomerServicePhone()

  // Función helper para crear un teléfono
  const createPhone = async (data: CustomerServicePhoneCreationDTO) => {
    if (!currentCopypoint?.id) {
      throw new Error('No hay un copypoint seleccionado')
    }
    return createMutation.mutateAsync({
      copypointId: currentCopypoint.id,
      data,
    })
  }

  // Obtener los teléfonos desde la respuesta paginada
  const customerServicePhones = query.data?.content || []

  // Obtener el primer teléfono (para compatibilidad con código existente)
  const customerServicePhone = customerServicePhones[0] || null

  return {
    // Datos de los teléfonos
    customerServicePhones,
    customerServicePhone, // Para compatibilidad con código existente
    totalPhones: query.data?.totalElements || 0,

    // Estados de la query
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,

    // Métodos
    refetch: query.refetch,
    createPhone,

    // Estados de las mutaciones
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Query y mutación raw para casos avanzados
    query,
    createMutation,
  }
}

// Hook alternativo que permite especificar el copypointId manualmente
export function useCustomerServicePhoneWithId(copypointId: number | string | undefined) {
  const query = useCustomerServicePhonesByCopypoint({
    copypointId,
    enabled: !!copypointId,
  })

  const createMutation = useCreateCustomerServicePhone()

  const createPhone = async (data: CustomerServicePhoneCreationDTO) => {
    if (!copypointId) {
      throw new Error('Copypoint ID no disponible')
    }
    return createMutation.mutateAsync({
      copypointId,
      data,
    })
  }

  // Obtener los teléfonos desde la respuesta paginada
  const customerServicePhones = query.data?.content || []

  // Obtener el primer teléfono (para compatibilidad con código existente)
  const customerServicePhone = customerServicePhones[0] || null

  return {
    customerServicePhones,
    customerServicePhone, // Para compatibilidad con código existente
    totalPhones: query.data?.totalElements || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,
    refetch: query.refetch,
    createPhone,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    query,
    createMutation,
  }
}