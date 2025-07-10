// hooks/usePaymentActions.ts
import { useCallback, useMemo } from 'react'
import { useAuth } from '@/stores/authStore.ts'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext.ts'
import { useCreatePayment, usePaymentStatus, usePaymentStatusPolling } from '@/features/mercadopago-payment/hooks/useMercadoPagoPayment.ts'
import { PaymentRequest, PayerInfo } from '@/features/mercadopago-payment/service/MercadoPagoPaymentResponse.type.ts'
import { toast } from 'sonner'

interface PaymentActionsOptions {
  onPaymentSuccess?: (paymentId: string, checkoutUrl: string) => void
  onPaymentError?: (error: Error) => void
  onPaymentStatusChange?: (status: string, paymentId: string) => void
  autoRedirect?: boolean
}

export const usePaymentActions = (options?: PaymentActionsOptions) => {
  const { user, isAuthenticated } = useAuth()
  const { currentSale } = useSaleContext()
  const createPaymentMutation = useCreatePayment()

  // Función para crear un pago
  const createPayment = useCallback(async (
    payerInfo: PayerInfo,
    customDescription?: string
  ) => {
    if (!isAuthenticated() || !user) {
      throw new Error('Usuario no autenticado')
    }

    if (!currentSale) {
      throw new Error('No hay una venta seleccionada')
    }

    const paymentRequest: PaymentRequest = {
      saleId: currentSale.id,
      description: customDescription || `Pago para venta #${currentSale.id}`,
      payer: payerInfo
    }

    try {
      const response = await createPaymentMutation.mutateAsync(paymentRequest)

      // Notificar éxito
      toast.success('Pago creado exitosamente')

      // Callback personalizado
      options?.onPaymentSuccess?.(response.paymentId, response.checkoutUrl)

      // Auto-redirección si está habilitada
      if (options?.autoRedirect && response.checkoutUrl) {
        window.location.href = response.checkoutUrl
      }

      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast.error(`Error al crear el pago: ${errorMessage}`)
      options?.onPaymentError?.(error as Error)
      throw error
    }
  }, [isAuthenticated, user, currentSale, createPaymentMutation, options])

  // Función para crear PayerInfo desde el usuario actual
  const createPayerFromUser = useCallback((
    phone: string,
    identification: string,
    identificationType: string = 'DNI'
  ): PayerInfo => {
    if (!user) {
      throw new Error('Usuario no disponible')
    }

    // Asumiendo que el usuario tiene firstName, lastName y email
    return {
      firstName: user.firstName || user.name?.split(' ')[0] || '',
      lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email,
      phone,
      identification,
      identificationType
    }
  }, [user])

  // Función para crear pago rápido con datos del usuario
  const createQuickPayment = useCallback(async (
    phone: string,
    identification: string,
    identificationType: string = 'DNI',
    customDescription?: string
  ) => {
    const payerInfo = createPayerFromUser(phone, identification, identificationType)
    return createPayment(payerInfo, customDescription)
  }, [createPayerFromUser, createPayment])

  // Estados computados
  const paymentState = useMemo(() => ({
    isCreating: createPaymentMutation.isPending,
    isSuccess: createPaymentMutation.isSuccess,
    isError: createPaymentMutation.isError,
    error: createPaymentMutation.error,
    data: createPaymentMutation.data,
    canCreatePayment: isAuthenticated() && !!currentSale,
  }), [
    createPaymentMutation.isPending,
    createPaymentMutation.isSuccess,
    createPaymentMutation.isError,
    createPaymentMutation.error,
    createPaymentMutation.data,
    isAuthenticated,
    currentSale
  ])

  // Función para resetear el estado del pago
  const resetPaymentState = useCallback(() => {
    createPaymentMutation.reset()
  }, [createPaymentMutation])

  return {
    // Acciones
    createPayment,
    createQuickPayment,
    createPayerFromUser,
    resetPaymentState,

    // Estados
    paymentState,

    // Datos del contexto
    currentSale,
    user,
    isAuthenticated: isAuthenticated(),

    // Información útil
    saleInfo: currentSale ? {
      id: currentSale.id,
      total: currentSale.total,
      // Agregar más campos según tu tipo SaleResponse
    } : null,
  }
}

// Hook especializado para el seguimiento de pagos
export const usePaymentTracking = (paymentId: string | null, options?: {
  enablePolling?: boolean
  onStatusChange?: (status: string) => void
}) => {
  const { onStatusChange } = options || {}

  // Query básica para obtener el estado
  const paymentStatusQuery = usePaymentStatus(paymentId || '', {
    enabled: !!paymentId,
    refetchInterval: options?.enablePolling ? 5000 : undefined,
  })

  // Polling query para pagos que necesitan seguimiento continuo
  const paymentPollingQuery = usePaymentStatusPolling(paymentId || '', {
    enabled: !!paymentId && options?.enablePolling,
    stopWhen: (status) => ['approved', 'rejected', 'cancelled'].includes(status.toLowerCase()),
  })

  // Usar la query de polling si está habilitado, si no el básico
  const activeQuery = options?.enablePolling ? paymentPollingQuery : paymentStatusQuery

  // Callback para cambios de estado
  const previousStatus = useMemo(() => {
    return activeQuery.data?.status
  }, [activeQuery.data?.status])

  // Detectar cambios de estado
  if (activeQuery.data?.status && activeQuery.data.status !== previousStatus) {
    onStatusChange?.(activeQuery.data.status)
  }

  return {
    paymentStatus: activeQuery.data,
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    error: activeQuery.error,
    refetch: activeQuery.refetch,

    // Estados helpers
    isPending: activeQuery.data?.status?.toLowerCase() === 'pending',
    isApproved: activeQuery.data?.status?.toLowerCase() === 'approved',
    isRejected: activeQuery.data?.status?.toLowerCase() === 'rejected',
    isCancelled: activeQuery.data?.status?.toLowerCase() === 'cancelled',

    // Información del pago
    paymentInfo: activeQuery.data ? {
      id: activeQuery.data.paymentId,
      status: activeQuery.data.status,
      amount: activeQuery.data.amount,
      currency: activeQuery.data.currency,
      errorMessage: activeQuery.data.errorMessage,
    } : null,
  }
}