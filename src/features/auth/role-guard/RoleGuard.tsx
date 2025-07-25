// 8. Componente para rutas con roles específicos
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '@/stores/authStore'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallbackTo?: string
}

export function RoleGuard({
  children,
  requiredRoles = [],
  fallbackTo = '/unauthorized',
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated()) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return <Navigate to='/sign-in' search='redirect=/sign-in' />
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some((role) =>
      user.role.includes(role)
    )

    if (!hasRequiredRole) {
      return <Navigate to={fallbackTo} />
    }
  }

  return <>{children}</>
}
