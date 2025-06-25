import { createFileRoute, redirect } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string || '/'),
    }
  },
  beforeLoad: async ({ context, search }) => {
    // Esperar a que termine de cargar antes de evaluar
    if (context.auth.isLoading) {
       await new Promise(resolve => setTimeout(resolve, 100))
      return
    }

    if (context.auth.isAuthenticated) {
      throw redirect({
        to: search.redirect || '/',
      })
    }
  },
  component: SignIn,
})
