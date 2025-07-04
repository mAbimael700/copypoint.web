import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions
} from '@tanstack/react-query';

import CopypointService from '../service/CopypointService.ts';
import { useAuth } from '@/stores/authStore';
import { PageResponse } from '@/features/api/HttpResponse.type';
import { CopypointResponse, CopypointCreationDTO } from '../Copypoint.type';
import { toast } from 'sonner';

// Tipos para los parámetros
interface CopypointsQueryParams {
    storeId: number | string;
    enabled?: boolean;
}

interface CreateCopypointParams {
    storeId: number | string;
    data: CopypointCreationDTO;
}

// Keys para el cache de queries
export const copypointKeys = {
    all: ['copypoints'] as const,
    byStore: (storeId: number | string) => [...copypointKeys.all, 'store', storeId] as const,
    detail: (storeId: number | string, id: number | string) =>
        [...copypointKeys.byStore(storeId), 'detail', id] as const,
};

/**
 * Hook para obtener todos los copypoints de una tienda
 */
export const useCopypoints = (
    params: CopypointsQueryParams,
    options?: Omit<UseQueryOptions<PageResponse<CopypointResponse>>, 'queryKey' | 'queryFn'>
) => {
    const { accessToken, isAuthenticated } = useAuth();

    return useQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: copypointKeys.byStore(params.storeId),
        queryFn: async (): Promise<PageResponse<CopypointResponse>> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            return await CopypointService.getAllByStore(params.storeId, accessToken);
        },
        enabled: isAuthenticated() && !!params.storeId && (params.enabled ?? true),
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: (failureCount, error: any) => {
            // No reintentar si es error de autorización
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 3;
        },
        ...options,
    });
};

/**
 * Hook para crear un nuevo copypoint
 */
export const useCreateCopypoint = (
    options?: UseMutationOptions<CopypointResponse, Error, CreateCopypointParams>
) => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    return useMutation({
        mutationFn: async (params: CreateCopypointParams): Promise<CopypointResponse> => {
            if (!accessToken) {
                throw new Error('Token de acceso no disponible');
            }
            return await CopypointService.create(params.storeId, accessToken, params.data);
        },
        onSuccess: (data, variables) => {
            // Invalidar y actualizar cache
            queryClient.invalidateQueries({
                queryKey: copypointKeys.byStore(variables.storeId)
            });

            // Opcional: Actualizar cache optimísticamente
            queryClient.setQueryData<PageResponse<CopypointResponse>>(
                copypointKeys.byStore(variables.storeId),
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        content: [data, ...oldData.content],
                        totalElements: oldData.totalElements + 1,
                    };
                }
            );

            toast.success('Copypoint creado exitosamente');
        },
        onError: () => {
            toast.error('Error al crear el copypoint');
        },
        ...options,
    });
};

/**
 * Hook principal que agrupa todas las funcionalidades
 */
export const useCopypointOperations = (storeId: number | string) => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    // Query para obtener copypoints
    const copypointsQuery = useCopypoints({
        storeId,
        enabled: !!storeId && isAuthenticated()
    });

    // Mutation para crear
    const createMutation = useCreateCopypoint();

    // Función para refrescar datos
    const refetch = () => {
        return copypointsQuery.refetch();
    };

    // Función para invalidar cache
    const invalidateCache = () => {
        queryClient.invalidateQueries({
            queryKey: copypointKeys.byStore(storeId)
        });
    };

    // Función para crear copypoint
    const createCopypoint = (data: CopypointCreationDTO) => {
        return createMutation.mutateAsync({ storeId, data });
    };

    // Estados derivados
    const isLoading = copypointsQuery.isLoading;
    const isError = copypointsQuery.isError;
    const isSuccess = copypointsQuery.isSuccess;
    const data = copypointsQuery.data;
    const error = copypointsQuery.error;

    // Estados de mutación
    const isCreating = createMutation.isPending;
    const createError = createMutation.error;

    return {
        // Datos
        copypoints: data?.content || [],
        totalElements: data?.totalElements || 0,
        totalPages: data?.totalPages || 0,

        // Estados de query
        isLoading,
        isError,
        isSuccess,
        error,

        // Estados de mutación
        isCreating,
        createError,

        // Funciones
        createCopypoint,
        refetch,
        invalidateCache,

        // Query original (por si necesitas acceso completo)
        query: copypointsQuery,
        createMutation,
    };
};

/**
 * Hook para prefetch de copypoints (útil para optimizaciones)
 */
export const usePrefetchCopypoints = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();

    const prefetchCopypoints = async (storeId: number | string) => {
        if (!accessToken) return;

        await queryClient.prefetchQuery({
          // eslint-disable-next-line @tanstack/query/exhaustive-deps
            queryKey: copypointKeys.byStore(storeId),
            queryFn: () => CopypointService.getAllByStore(storeId, accessToken),
            staleTime: 5 * 60 * 1000,
        });
    };

    return { prefetchCopypoints };
};

// Export por defecto del hook principal
export default useCopypointOperations;