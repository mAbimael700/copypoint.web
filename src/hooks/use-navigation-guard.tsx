import { useRouter, useRouterState } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FieldValues, UseFormReturn } from 'react-hook-form'

interface NavigationGuardOptions {
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
}

interface NavigationGuardReturn {
    NavigationGuardDialog: React.ComponentType
    setBlocked: (blocked: boolean) => void
    isBlocked: boolean
}

export function useNavigationGuard(
    shouldBlock: boolean, // Cambiado: ahora es reactivo
    options: NavigationGuardOptions = {}
): NavigationGuardReturn {
    const [isBlocked, setIsBlocked] = useState(shouldBlock)
    const [showDialog, setShowDialog] = useState(false)
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)
    const router = useRouter()
    const routerState = useRouterState()
    const currentPathRef = useRef(routerState.location.pathname)

    // Actualizar isBlocked cuando cambie shouldBlock
    useEffect(() => {
        setIsBlocked(shouldBlock)
    }, [shouldBlock])

    const {
        title = "¿Estás seguro?",
        description = "Tienes cambios sin guardar. Si sales ahora, se perderán todos los cambios.",
        confirmText = "Salir sin guardar",
        cancelText = "Cancelar"
    } = options

    // Interceptar navegación usando el router de TanStack
    useEffect(() => {
        if (!isBlocked) return

        const originalNavigate = router.navigate

        // Interceptar router.navigate
        const interceptedNavigate = (options: any) => {
            if (isBlocked) {
                // Verificar si es una navegación real (a una ruta diferente)
                const isNavToSamePath = 
                    typeof options === 'object' && 
                    options.to && 
                    options.to.href === routerState.location.href;

                if (isNavToSamePath) {
                    return originalNavigate.call(router, options);
                }

                return new Promise<void>((resolve, reject) => {
                    setPendingNavigation(() => () => {
                        setIsBlocked(false) // Temporalmente desbloquear
                        try {
                            const result = originalNavigate.call(router, options)
                            if (result && typeof result.then === 'function') {
                                result.then(resolve).catch(reject)
                            } else {
                                resolve()
                            }
                        } catch (error) {
                            reject(error)
                        }
                    })
                    setShowDialog(true)
                })
            }
            return originalNavigate.call(router, options)
        }

        // Reemplazar temporalmente el método navigate
        Object.defineProperty(router, 'navigate', {
            value: interceptedNavigate,
            writable: true,
            configurable: true
        })

        // Interceptar history.pushState y replaceState
        const originalPushState = history.pushState
        const originalReplaceState = history.replaceState

        const interceptPushState = function (state: any, title: string, url?: string | URL | null) {
            if (isBlocked && url && url !== currentPathRef.current) {
                setPendingNavigation(() => () => {
                    setIsBlocked(false)
                    originalPushState.call(history, state, title, url)
                })
                setShowDialog(true)
                return
            }
            originalPushState.call(history, state, title, url)
        }

        const interceptReplaceState = function (state: any, title: string, url?: string | URL | null) {
            if (isBlocked && url && url !== currentPathRef.current) {
                setPendingNavigation(() => () => {
                    setIsBlocked(false)
                    originalReplaceState.call(history, state, title, url)
                })
                setShowDialog(true)
                return
            }
            originalReplaceState.call(history, state, title, url)
        }

        history.pushState = interceptPushState
        history.replaceState = interceptReplaceState

        // Interceptar el botón de retroceso
        const handlePopState = (_: PopStateEvent) => {
            if (isBlocked) {
                // Restaurar la URL actual
                history.pushState(null, '', currentPathRef.current)

                setPendingNavigation(() => () => {
                    setIsBlocked(false)
                    history.back()
                })
                setShowDialog(true)
            }
        }

        window.addEventListener('popstate', handlePopState)

        return () => {
            // Restaurar funciones originales
            Object.defineProperty(router, 'navigate', {
                value: originalNavigate,
                writable: true,
                configurable: true
            })
            history.pushState = originalPushState
            history.replaceState = originalReplaceState
            window.removeEventListener('popstate', handlePopState)
        }
    }, [isBlocked, router])

    // Actualizar la referencia de la ruta actual
    useEffect(() => {
        currentPathRef.current = routerState.location.pathname
    }, [routerState.location.pathname])

    // Bloquear cierre de pestaña/navegador
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isBlocked) {
                e.preventDefault()
                e.returnValue = '' // Algunos navegadores requieren esto
                return ''
            }
        }

        if (isBlocked) {
            window.addEventListener('beforeunload', handleBeforeUnload)
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [isBlocked])

    const handleConfirm = useCallback(() => {
        setShowDialog(false)
        if (pendingNavigation) {
            pendingNavigation()
            setPendingNavigation(null)
        }
    }, [pendingNavigation])

    const handleCancel = useCallback(() => {
        setShowDialog(false)
        setPendingNavigation(null)
    }, [])

    const setBlocked = useCallback((blocked: boolean) => {
        setIsBlocked(blocked)
    }, [])

    const NavigationGuardDialog = useCallback(() => (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogContent >
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-destructive text-background hover:bg-destructive/90"
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ), [showDialog, title, description, confirmText, cancelText, handleConfirm, handleCancel])

    return {
        NavigationGuardDialog,
        setBlocked,
        isBlocked
    }
}

// Hook alternativo más específico para formularios
export function useFormNavigationGuard(hasUnsavedChanges: boolean) {
    return useNavigationGuard(hasUnsavedChanges, {
        title: "¿Descartar cambios?",
        description: "Tienes cambios sin guardar en el formulario. Si sales ahora, se perderán todos los cambios realizados.",
        confirmText: "Descartar cambios",
        cancelText: "Continuar editando"
    })
}

interface FormNavigationGuardOptions extends NavigationGuardOptions {
    // Opciones adicionales específicas para formularios
}

/**
 * Hook especializado para usar con React Hook Form
 * Automáticamente detecta cambios usando form.formState.isDirty
 */
export function useHookFormNavigationGuard<T extends FieldValues = FieldValues>(
    form: UseFormReturn<T>,
    options: FormNavigationGuardOptions = {}
) {
    const defaultOptions: FormNavigationGuardOptions = {
        title: "¿Descartar cambios?",
        description: "Has realizado cambios en el formulario. ¿Estás seguro de que quieres salir sin guardar?",
        confirmText: "Descartar cambios",
        cancelText: "Continuar editando",
        ...options
    }

    // Usar un estado para rastrear si hay cambios sin guardar, combinando
    // tanto el estado isDirty del formulario como las actualizaciones manuales
    const [manuallyChanged, setManuallyChanged] = useState(false);
    const isDirty = form.formState.isDirty || manuallyChanged;

    const { NavigationGuardDialog, setBlocked, isBlocked } = useNavigationGuard(
        isDirty,
        defaultOptions
    )

    // Función para desbloquear después de guardar exitosamente
    const markAsSaved = (newData?: T) => {
        setBlocked(false)
        setManuallyChanged(false)
        if (newData) {
            form.reset(newData)
        } else {
            // Marcar el formulario como pristine sin cambiar los valores
            form.reset(form.getValues())
        }
    }

    // Función para marcar manualmente como modificado
    const markAsChanged = () => {
        setManuallyChanged(true)
        setBlocked(true)
    }

    return {
        NavigationGuardDialog,
        setBlocked,
        isBlocked,
        markAsSaved,
        markAsChanged,
        hasUnsavedChanges: isDirty
    }
}