// hooks/useMercadoPago.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/stores/authStore.ts'
import MercadoPagoPaymentService from '@/features/mercadopago-payment/service/MercadoPagoPaymentService'
import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatusResponse,
} from '@/features/mercadopago-payment/service/MercadoPagoPaymentResponse.type.ts'

// Query Keys
export const mercadopagoKeys = {
  all: ['mercadopago'] as const,
  payments: () => [...mercadopagoKeys.all, 'payments'] as const,
  payment: (id: string) => [...mercadopagoKeys.payments(), id] as const,
  paymentStatus: (id: string) =>
    [...mercadopagoKeys.payment(id), 'status'] as const,
}

// Hook para crear un pago
export const useCreatePayment = () => {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      paymentData: PaymentRequest
    ): Promise<PaymentResponse> => {
      if (!accessToken) {
        throw new Error('No access token available')
      }
      return await MercadoPagoPaymentService.create(accessToken, paymentData)
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas si es necesario
      queryClient.invalidateQueries({ queryKey: mercadopagoKeys.payments() })

      // Opcional: Agregar el pago al cache
      if (data.paymentId) {
        queryClient.setQueryData(mercadopagoKeys.payment(data.paymentId), data)
      }
    },
    onError: (error) => {
      throw toast.error('Error creating payment: ' + error.message)
    },
  })
}

// Hook para obtener el estado de un pago
export const usePaymentStatus = (
  paymentId: string,
  options?: {
    enabled?: boolean
    refetchInterval?: number
  }
) => {
  const { accessToken } = useAuth()

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: mercadopagoKeys.paymentStatus(paymentId),
    queryFn: async (): Promise<PaymentStatusResponse> => {
      if (!accessToken) {
        throw new Error('No access token available')
      }
      return await MercadoPagoPaymentService.getPaymentStatus(
        accessToken,
        paymentId
      )
    },
    enabled: !!accessToken && !!paymentId && options?.enabled !== false,
    refetchInterval: options?.refetchInterval || 5000, // Refetch cada 5 segundos por defecto
    retry: 3,
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}

// Hook para polling del estado de pago (útil para pagos pendientes)
export const usePaymentStatusPolling = (
  paymentId: string,
  options?: {
    enabled?: boolean
    stopWhen?: (status: string) => boolean
  }
) => {
  const { accessToken } = useAuth()

  return useQuery({
    'queryKey': mercadopagoKeys.paymentStatus(paymentId),
    queryFn: async (): Promise<PaymentStatusResponse> => {
      if (!accessToken) {
        throw new Error('No access token available')
      }
      return await MercadoPagoPaymentService.getPaymentStatus(
        accessToken,
        paymentId
      )
    },
    enabled: !!accessToken && !!paymentId && options?.enabled !== false,
    refetchInterval: (data) => {
      // Si tenemos datos y el callback stopWhen retorna true, parar el polling
      if (data && options?.stopWhen /* &&  options.stopWhen(data.status)*/) {
        return false
      }
      return 3000 // Polling cada 3 segundos
    },
    retry: 3,
  })
}

// Hook para invalidar queries de MercadoPago
export const useInvalidateMercadoPago = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: mercadopagoKeys.all }),
    invalidatePayments: () =>
      queryClient.invalidateQueries({ queryKey: mercadopagoKeys.payments() }),
    invalidatePayment: (paymentId: string) =>
      queryClient.invalidateQueries({
        queryKey: mercadopagoKeys.payment(paymentId),
      }),
    invalidatePaymentStatus: (paymentId: string) =>
      queryClient.invalidateQueries({
        queryKey: mercadopagoKeys.paymentStatus(paymentId),
      }),
  }
}
