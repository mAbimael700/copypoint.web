import { useAuth } from '@/stores/authStore'
import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

export function useAuthGuard() {
    const { isAuthenticated, loadUserProfile, accessToken, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            // Si hay token pero no usuario, intentar cargar perfil
            if (accessToken && !isAuthenticated()) {
                await loadUserProfile()
            }
        }

        checkAuth()
    }, [accessToken, isAuthenticated, loadUserProfile])

    return {
        isAuthenticated: isAuthenticated(),
        isLoading,
        redirectToLogin: () => router.navigate({ to: '/sign-in', search: { redirect: "/" } })
    }
}
