// 8. Componente para rutas con roles específicos
import { useAuth } from '@/stores/authStore'
import { Navigate } from '@tanstack/react-router'

interface RoleGuardProps {
    children: React.ReactNode
    requiredRoles?: string[]
    fallbackTo?: string
}

export function RoleGuard({
    children,
    requiredRoles = [],
    fallbackTo = '/unauthorized'
}: RoleGuardProps) {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated()) {
        return <Navigate to="/sign-in" />
    }

    if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.some(role =>
            user.role.includes(role)
        )

        if (!hasRequiredRole) {
            return <Navigate to={fallbackTo} />
        }
    }

    return <>{children}</>
}