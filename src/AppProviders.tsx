import { StrictMode, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuth, useAuthStore } from '@/stores/authStore'
import { handleServerError } from '@/utils/handle-server-error'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import './index.css'
// Generated Routes
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                // eslint-disable-next-line no-console
                if (import.meta.env.DEV) console.log({ failureCount, error })

                if (failureCount >= 0 && import.meta.env.DEV) return false
                if (failureCount > 3 && import.meta.env.PROD) return false

                return !(
                    error instanceof AxiosError &&
                    [401, 403].includes(error.response?.status ?? 0)
                )
            },
            refetchOnWindowFocus: import.meta.env.PROD,
            staleTime: 10 * 1000, // 10s
        },
        mutations: {
            onError: (error) => {
                handleServerError(error)

                if (error instanceof AxiosError) {
                    if (error.response?.status === 304) {
                        toast.error('Content not modified!')
                    }
                }
            },
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    toast.error('Session expired!')
                    useAuthStore.getState().auth.reset()
                    const redirect = `${router.history.location.href}`
                    router.navigate({ to: '/sign-in', search: { redirect } })
                }
                if (error.response?.status === 500) {
                    toast.error('Internal Server Error!')
                    router.navigate({ to: '/500' })
                }
                if (error.response?.status === 403) {
                    router.navigate({ to: "/403" });
                }
            }
        },
    }),
})

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        queryClient, auth: {
            isAuthenticated: false,
            user: null,
            isLoading: true,
        },
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

function AppWithProviders() {
    const auth = useAuth()
    const [isInitialized, setIsInitialized] = useState(false)


    // Inicializar autenticación al cargar la app
    useEffect(() => {
        let isMounted = true

        const initializeApp = async () => {
            try {
                await auth.initialize()
            } catch (error) {
                console.error('Error initializing auth:', error)
            } finally {
                if (isMounted) {
                    setIsInitialized(true)
                }
            }
        }

        initializeApp()

        return () => {
            isMounted = false
        }
    }, []) // Sin dependencias - solo se ejecuta una vez

    // Effect separado para updates del router cuando el estado cambia
    useEffect(() => {
        if (!isInitialized) return

        const authState = {
            isAuthenticated: auth.isAuthenticated(),
            user: auth.user,
            isLoading: auth.isLoading,
        }

        //console.log('Updating router context:', authState)

        router.update({
            context: {
                queryClient,
                auth: authState,
            },
        })

        // Navegación automática después de login
        if (authState.isAuthenticated && !authState.isLoading) {
            const currentPath = router.state.location.pathname
            if (currentPath.includes('sign-in')) {
                // Usar requestAnimationFrame para evitar problemas de timing
                requestAnimationFrame(() => {
                    router.navigate({ to: '/', replace: true })
                })
            }
        }
    }, [isInitialized, auth.user, auth.isLoading]) // Depender de valores primitivos

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
                <FontProvider>
                    <RouterProvider router={router} />
                </FontProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default function App() {
    return (
        <StrictMode>
            <AppWithProviders />
        </StrictMode>
    )
}