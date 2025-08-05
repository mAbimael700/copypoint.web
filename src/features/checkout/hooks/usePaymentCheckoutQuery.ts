import { useQuery } from '@tanstack/react-query';
import { paymentCheckoutService } from '@/features/payments/services/PaymentCheckoutService';
import { useAuth } from '@clerk/clerk-react';

export const usePaymentCheckoutQuery = (paymentId: number | string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['paymentCheckout', paymentId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Authentication token not available');

      return paymentCheckoutService.getPaymentCheckoutByPayment(
        paymentId,
        token
      );
    },
    enabled: !!paymentId,
  });
};
