import { useMutation, useQuery } from '@tanstack/react-query';
import { PaymentService } from '../services/MercadoPagoConfigService';
import {
  MercadoPagoConfigCreationRequest,
} from '../types/MercadoPagoConfig.type';
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext';
import { useAuth } from '@/stores/authStore';

interface MercadoPagoConfigQueryParams {
  copypointId?: number | string;
  accessToken?: string;
  enabled?: boolean;
}

export const useMercadoPagoConfigs = ({
  copypointId,
  accessToken,
  enabled = true,
}: MercadoPagoConfigQueryParams = {}) => {
  const { currentCopypoint } = useCopypointContext();
  const auth = useAuth();

  const effectiveCopypointId = copypointId || currentCopypoint?.id;
  const effectiveAccessToken = accessToken || auth.accessToken;

  return useQuery({
    queryKey: ['mercadoPagoConfigs', effectiveCopypointId, effectiveAccessToken],
    queryFn: () => {
      if (!effectiveCopypointId || !effectiveAccessToken) {
        throw new Error('Se requiere un ID de copypoint y token de acceso');
      }
      return PaymentService.getByCopypoint(effectiveCopypointId, effectiveAccessToken);
    },
    enabled: enabled && !!effectiveCopypointId && !!effectiveAccessToken,
  });
};

/**
 * Hook simplificado para obtener la configuración de MercadoPago del copypoint actual
 * 
 * Utiliza automáticamente el copypoint actual del contexto y el token de autenticación
 */
export const useCurrentCopypointMercadoPagoConfig = (enabled = true) => {
  const { currentCopypoint } = useCopypointContext();
  const auth = useAuth();

  return useMercadoPagoConfigs({
    copypointId: currentCopypoint?.id,
    accessToken: auth.accessToken,
    enabled: enabled && !!currentCopypoint?.id && !!auth.accessToken
  });
};

export const useCreateMercadoPagoConfig = () => {
  const { currentCopypoint } = useCopypointContext();
  const auth = useAuth();

  return useMutation({
    mutationFn: ({
      copypointId,
      accessToken,
      data,
    }: {
      copypointId?: number | string;
      accessToken?: string;
      data: MercadoPagoConfigCreationRequest;
    }) => {
      const effectiveCopypointId = copypointId || currentCopypoint?.id;
      const effectiveAccessToken = accessToken || auth.accessToken;

      if (!effectiveCopypointId || !effectiveAccessToken) {
        throw new Error('Se requiere un ID de copypoint y token de acceso');
      }

      return PaymentService.createMercadoPagoConfig(effectiveCopypointId, effectiveAccessToken, data);
    },
  });
};

export const useGenerateMPToken = () => {
  const auth = useAuth();

  return useMutation({
    mutationFn: ({ accessToken }: { accessToken?: string } = {}) => {
      const effectiveAccessToken = accessToken || auth.accessToken;

      if (!effectiveAccessToken) {
        throw new Error('Se requiere un token de acceso');
      }

      return PaymentService.generateMPToken(effectiveAccessToken);
    },
  });
};
