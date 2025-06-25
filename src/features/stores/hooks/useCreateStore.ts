// src/features/store/hooks/useCreateStore.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import StoreService from '@/features/stores/StoreService'
import { StoreCreationDTO, StoreResponse } from '../Store.type'
import { useAuth } from '@/stores/authStore'
import { useStoreContext } from '../storage/useStoreContext'

export const useCreateStore = () => {
    const { accessToken } = useAuth()
    const queryClient = useQueryClient()
    const { setActiveStore } = useStoreContext()

    return useMutation({
        mutationFn: (newStore: StoreCreationDTO) =>
            StoreService.create(accessToken, newStore),

        onSuccess: (createdStore: StoreResponse) => {
            // Actualiza directamente el cache local si ya hay stores cargados
            queryClient.setQueryData(['stores'], (prev: any) => {
                if (!prev) return { content: [createdStore] }
                return {
                    ...prev,
                    content: [createdStore, ...prev.content],
                }
            })

            // Establece la nueva tienda como activa
            setActiveStore(createdStore)
        },
    })
}
