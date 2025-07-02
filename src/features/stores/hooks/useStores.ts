// hooks/useStores.ts
import { useQuery } from '@tanstack/react-query'
import StoreService from '@/features/stores/StoreService'
import { StoreResponse } from '@/features/stores/Store.type'
import { PageResponse } from '@/api/HttpResponse.type'
import { useAuth } from '@/stores/authStore'

// Puedes definir una key reutilizable para el cache
const STORES_QUERY_KEY = ['stores']

export const useStores = () => {
    const { accessToken } = useAuth()

    const getAll = () => useQuery<PageResponse<StoreResponse>>({
        queryKey: STORES_QUERY_KEY,
        queryFn: () => StoreService.getAll(accessToken),
        enabled: !!accessToken, // Solo ejecutar si hay token
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 1,
        refetchOnWindowFocus: false,
    })

    return { getAll }
}

const useStoresContext = () => { }
