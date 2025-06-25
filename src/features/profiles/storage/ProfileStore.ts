import { create } from 'zustand'
import { ProfileResponse } from '@/features/profiles/Profile.type'
import { Service } from '@/features/services/Service.type'

type ProfileDialogType = 'create' | 'update' | 'delete'

interface ProfileStore {
    // Estados
    open: ProfileDialogType | null
    currentProfile: ProfileResponse | null
    currentService: Service | null

    // Acciones
    setOpen: (dialogType: ProfileDialogType | null) => void
    setCurrentProfile: (profile: ProfileResponse | null) => void
    setCurrentService: (service: Service | null) => void

    // Acciones adicionales para mayor funcionalidad
    openDialog: (dialogType: ProfileDialogType, profile?: ProfileResponse) => void
    closeDialog: () => void
    reset: () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
    // Estado inicial
    open: null,
    currentProfile: null,
    currentService: null,

    // Acciones básicas
    setOpen: (dialogType) => set({ open: dialogType }),
    setCurrentProfile: (profile) => set({ currentProfile: profile }),
    setCurrentService: (service) => set({ currentService: service }),

    // Acciones compuestas para mayor comodidad
    openDialog: (dialogType, profile) => set({
        open: dialogType,
        currentProfile: profile || null
    }),
    closeDialog: () => set({
        open: null,
        currentProfile: null
    }),
    reset: () => set({
        open: null,
        currentProfile: null,
        currentService: null
    })
}))

// Hook personalizado que mantiene la misma API que tu context original
export const useProfileModule = () => {
    const store = useProfileStore()

    return {
        open: store.open,
        setOpen: store.setOpen,
        currentProfile: store.currentProfile,
        setCurrentProfile: store.setCurrentProfile,
        currentService: store.currentService,
        setCurrentService: store.setCurrentService,

        // Métodos adicionales disponibles
        openDialog: store.openDialog,
        closeDialog: store.closeDialog,
        reset: store.reset
    }
}