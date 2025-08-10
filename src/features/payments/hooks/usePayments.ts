import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useAuth } from '@/stores/authStore.ts'
import { PageResponse } from '@/features/api/HttpResponse.type.ts'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import { PaymentService } from '../services/PaymentService'
import { PaymentResponse } from '../types/Payment.type'
import { paymentKeys } from './payment-keys'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext.ts'

interface PaymentQueryParams {
  copypointId?: number
  enabled?: boolean
}

interface PaymentBySaleQueryParams {
  saleId: number
  enabled?: boolean
}

export const usePaymentBySale = (
  params?: PaymentBySaleQueryParams,
  options?: Omit<
    UseQueryOptions<PageResponse<PaymentResponse>>,
    'queryKey' | 'queryFn'
  >
) => {
  const { accessToken, isAuthenticated } = useAuth()
  const { currentSale } = useSaleContext()

  // Usar el copypoint del store si no se proporciona uno específico
  const saleId = params?.saleId || currentSale?.id

  const query = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: paymentKeys.bySale(saleId!),
    queryFn: async (): Promise<PageResponse<PaymentResponse>> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      return await PaymentService.getPaymentsBySale(
        saleId!,
        accessToken
      )
    },
    enabled: isAuthenticated() && !!saleId && (params?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false
      }
      return failureCount < 3
    },
    ...options,
  })

  // Extraer los payments del resultado paginado
  const payments = query.data?.content || []

  return {
    data: query.data,
    payments,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  }
}

const usePayments = (
  params?: PaymentQueryParams,
  options?: Omit<
    UseQueryOptions<PageResponse<PaymentResponse>>,
    'queryKey' | 'queryFn'
  >
) => {
  const { accessToken, isAuthenticated } = useAuth()
  const { currentCopypoint } = useCopypointContext()

  // Usar el copypoint del store si no se proporciona uno específico
  const copypointId = params?.copypointId || currentCopypoint?.id

  const query = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: paymentKeys.byCopypoint(copypointId!),
    queryFn: async (): Promise<PageResponse<PaymentResponse>> => {
      if (!accessToken) {
        throw new Error('Token de acceso no disponible')
      }
      return await PaymentService.getPaymentsByCopypoint(
        copypointId!,
        accessToken
      )
    },
    enabled: isAuthenticated() && !!copypointId && (params?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false
      }
      return failureCount < 3
    },
    ...options,
  })

  // Extraer los payments del resultado paginado
  const payments = query.data?.content || []

  return {
    data: query.data,
    payments,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  }
}

export default usePayments
