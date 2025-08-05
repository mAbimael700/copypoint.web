import { useQuery } from '@tanstack/react-query';
import { paymentCheckoutService } from '@/features/payments/services/PaymentCheckoutService';
import { PaymentCheckoutData } from '@/features/checkout/types/PaymentCheckoutData.type';
import { useAuth } from '@/stores/authStore';

export const PAYMENT_CHECKOUT_QUERY_KEY = 'paymentCheckout';

interface UsePaymentCheckoutQueryOptions {
  paymentId: number | string;
  enabled?: boolean;
  onSuccess?: (data: PaymentCheckoutData) => void;
  onError?: (error: unknown) => void;
}

export const usePaymentCheckoutQuery = ({
  paymentId,
  enabled = true,
  onSuccess,
  onError,
}: UsePaymentCheckoutQueryOptions) => {
  const { accessToken } = useAuth();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return useQuery({
    initialData: undefined,
    queryKey: [PAYMENT_CHECKOUT_QUERY_KEY, paymentId, accessToken],
    queryFn: () => paymentCheckoutService.getPaymentCheckoutByPayment(paymentId, accessToken),
    enabled: enabled && !!accessToken && !!paymentId,
    onSuccess,
    onError,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });
};
