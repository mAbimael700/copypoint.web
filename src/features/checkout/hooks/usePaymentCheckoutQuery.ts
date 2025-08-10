import { useQuery } from '@tanstack/react-query';
import { paymentCheckoutService } from '@/features/payments/services/PaymentCheckoutService';
import { useAuth } from '@/stores/authStore.ts'

export const usePaymentCheckoutQuery = (paymentId: number | string) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['paymentCheckout', paymentId, accessToken],
    queryFn: async () => {
      const token = accessToken;
      if (!token) throw new Error('Authentication token not available');

      return paymentCheckoutService.getPaymentCheckoutByPayment(
        paymentId,
        token
      );
    },
    enabled: !!paymentId,
  });
};
