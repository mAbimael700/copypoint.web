import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { useAuth } from '@/stores/authStore'
import IntegrationService from '../service/IntegrationService'
import {
  IntegrationSummary,
  IntegrationStats,
  PaymentIntegration,
  MessagingIntegration,
} from '../types/integration.type.ts'

// Query parameters interface
interface IntegrationQueryParams {
  copypointId: number | string
  enabled?: boolean
}

// Query cache keys
export const integrationKeys = {
  all: ['integrations'] as const,
  byCopypoint: (copypointId: number | string) =>
    [...integrationKeys.all, 'copypoint', copypointId] as const,
  summary: (copypointId: number | string) =>
    [...integrationKeys.byCopypoint(copypointId), 'summary'] as const,
  payment: (copypointId: number | string) =>
    [...integrationKeys.byCopypoint(copypointId), 'payment'] as const,
  messaging: (copypointId: number | string) =>
    [...integrationKeys.byCopypoint(copypointId), 'messaging'] as const,
  stats: (copypointId: number | string) =>
    [...integrationKeys.byCopypoint(copypointId), 'stats'] as const,
  status: (copypointId: number | string) =>
    [...integrationKeys.byCopypoint(copypointId), 'status'] as const,
}

/**
 * Hook to get integration summary for a copypoint
 */
export const useIntegrationSummary = (
  params: IntegrationQueryParams,
  options?: Omit<UseQueryOptions<IntegrationSummary>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: integrationKeys.summary(params.copypointId),
    queryFn: async (): Promise<IntegrationSummary> => {
      if (!accessToken) {
        throw new Error('Access token not available')
      }
      return await IntegrationService.getByCopypoint(
        params.copypointId,
        accessToken
      )
    },
    enabled:
      isAuthenticated() && !!params.copypointId && (params.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on authorization errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false
      }
      return failureCount < 3
    },
    ...options,
  })
}

/**
 * Hook to get payment integrations for a copypoint
 */
export const usePaymentIntegrations = (
  params: IntegrationQueryParams,
  options?: Omit<UseQueryOptions<PaymentIntegration>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: integrationKeys.payment(params.copypointId),
    queryFn: async (): Promise<PaymentIntegration> => {
      if (!accessToken) {
        throw new Error('Access token not available')
      }
      return await IntegrationService.getPaymentIntegrationsByCopypoint(
        params.copypointId,
        accessToken
      )
    },
    enabled:
      isAuthenticated() && !!params.copypointId && (params.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Hook to get messaging integrations for a copypoint
 */
export const useMessagingIntegrations = (
  params: IntegrationQueryParams,
  options?: Omit<UseQueryOptions<MessagingIntegration>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: integrationKeys.messaging(params.copypointId),
    queryFn: async (): Promise<MessagingIntegration> => {
      if (!accessToken) {
        throw new Error('Access token not available')
      }
      return await IntegrationService.getMessagingIntegrationsByCopypoint(
        params.copypointId,
        accessToken
      )
    },
    enabled:
      isAuthenticated() && !!params.copypointId && (params.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Hook to get integration stats for a copypoint
 */
export const useIntegrationStats = (
  params: IntegrationQueryParams,
  options?: Omit<UseQueryOptions<IntegrationStats>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: integrationKeys.stats(params.copypointId),
    queryFn: async (): Promise<IntegrationStats> => {
      if (!accessToken) {
        throw new Error('Access token not available')
      }
      return await IntegrationService.getStatsByCopypoint(
        params.copypointId,
        accessToken
      )
    },
    enabled:
      isAuthenticated() && !!params.copypointId && (params.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Hook to check if a copypoint has active integrations
 */
export const useActiveIntegrationStatus = (
  params: IntegrationQueryParams,
  options?: Omit<UseQueryOptions<IntegrationStats>, 'queryKey' | 'queryFn'>
) => {
  const { accessToken, isAuthenticated } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: integrationKeys.status(params.copypointId),
    queryFn: async (): Promise<IntegrationStats> => {
      if (!accessToken) {
        throw new Error('Access token not available')
      }
      return await IntegrationService.hasActiveIntegrations(
        params.copypointId,
        accessToken
      )
    },
    enabled:
      isAuthenticated() && !!params.copypointId && (params.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

/**
 * Main hook that groups all integration functionalities
 */
export const useIntegrations = (copypointId: number | string) => {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // Queries for different integration data
  const summaryQuery = useIntegrationSummary({
    copypointId,
    enabled: !!copypointId && isAuthenticated(),
  })

  const statsQuery = useIntegrationStats({
    copypointId,
    enabled: !!copypointId && isAuthenticated(),
  })

  const statusQuery = useActiveIntegrationStatus({
    copypointId,
    enabled: !!copypointId && isAuthenticated(),
  })

  // Function to refresh data
  const refetchAll = () => {
    return Promise.all([
      summaryQuery.refetch(),
      statsQuery.refetch(),
      statusQuery.refetch(),
    ])
  }

  // Function to invalidate cache
  const invalidateCache = () => {
    queryClient.invalidateQueries({
      queryKey: integrationKeys.byCopypoint(copypointId),
    })
  }

  // Derived states
  const isLoading =
    summaryQuery.isLoading || statsQuery.isLoading || statusQuery.isLoading
  const isError =
    summaryQuery.isError || statsQuery.isError || statusQuery.isError
  const isSuccess =
    summaryQuery.isSuccess && statsQuery.isSuccess && statusQuery.isSuccess

  const error = summaryQuery.error || statsQuery.error || statusQuery.error

  return {
    // Data
    summary: summaryQuery.data,
    stats: statsQuery.data,
    hasActiveIntegrations:
      statusQuery.data?.activeIntegrations &&
      statusQuery
        .data?.activeIntegrations > 0,

    // Query states
    isLoading,
    isError,
    isSuccess,
    error,

    // Functions
    refetchAll,
    invalidateCache,

    // Individual queries (for full access if needed)
    summaryQuery,
    statsQuery,
    statusQuery,

    // Utility hooks for specific data
    usePaymentIntegrations,
    useMessagingIntegrations,
  }
}

/**
 * Hook for prefetching integration data (useful for optimizations)
 */
export const usePrefetchIntegrations = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()

  const prefetchIntegrations = async (copypointId: number | string) => {
    if (!accessToken) return

    await queryClient.prefetchQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: integrationKeys.summary(copypointId),
      queryFn: () =>
        IntegrationService.getByCopypoint(copypointId, accessToken),
      staleTime: 5 * 60 * 1000,
    })
  }

  return { prefetchIntegrations }
}

export default useIntegrations
