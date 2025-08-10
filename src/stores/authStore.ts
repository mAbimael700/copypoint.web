import AuthService from '@/features/auth/AuthService'
import { AuthUser } from '@/features/auth/AuthUser.type'

import Cookies from 'js-cookie'
import { create } from 'zustand'
import { toast } from 'sonner'

const ACCESS_TOKEN = 'thisisjustarandomstring'


interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    loadUserProfile: () => Promise<boolean>
    isAuthenticated: () => boolean
    isLoading: boolean
    setLoading: (loading: boolean) => void
    initialize: () => Promise<void> // Nueva función
  }
}

export const useAuthStore = create<AuthState>()(
  (set, get) => {
    const cookieState = Cookies.get(ACCESS_TOKEN)
    const initToken = cookieState ? JSON.parse(cookieState) : ''
    return {
      auth: {
        user: null,
        accessToken: initToken,
        isLoading: false,

        setUser: (user) =>
          set((state) => ({ ...state, auth: { ...state.auth, user } })),


        setLoading: (isLoading) =>
          set((state) => ({ ...state, auth: { ...state.auth, isLoading } })),


        setAccessToken: (accessToken) =>
          set((state) => {
            Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
            return { ...state, auth: { ...state.auth, accessToken } }
          }),

        resetAccessToken: () =>
          set((state) => {
            Cookies.remove(ACCESS_TOKEN)
            return { ...state, auth: { ...state.auth, accessToken: '' } }
          }),

        reset: () =>
          set((state) => {
            Cookies.remove(ACCESS_TOKEN)
            return {
              ...state,
              auth: { ...state.auth, user: null, accessToken: '' },
            }
          }),

        async login(email, password) {
          try {
            get().auth.setLoading(true)
            const response = await AuthService.login({ email, password });
            const token = response.token;

            if (token) {
              get().auth.setAccessToken(token)
              return await get().auth.loadUserProfile()
            }

            return false
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            return false
          } finally {
            get().auth.setLoading(false)
          }
        },

        async loadUserProfile() {
          const { accessToken } = get().auth
          if (!accessToken) return false

          try {
            const response = await AuthService.getUserProfile(accessToken)
            get().auth.setUser(response)
            return true
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            return false
          }
        },


        logout: async () => {
          const { accessToken } = get().auth

          // Opcional: Invalidar token en el backend
          if (accessToken) {
            try {
              await AuthService.logout(accessToken)
            } catch (error) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              toast.error('Error en logout: ' + error.message)
            }
          }

          get().auth.reset()
        },

        isAuthenticated: (): boolean => {
          const { accessToken, user } = get().auth
          return !!(accessToken && user)
        },

        // Nueva función para inicializar el estado de autenticación
        initialize: async () => {
          const { accessToken } = get().auth

          if (accessToken) {
            await get().auth.loadUserProfile()
          } else {
            get().auth.setLoading(false)
          }
        },
      },
    }
  })


export const useAuth = () => useAuthStore((state) => state.auth)
