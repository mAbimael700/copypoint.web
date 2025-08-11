'use client'

import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useHookFormNavigationGuard } from '@/hooks/use-navigation-guard.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Form } from '@/components/ui/form.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { FormProps } from '@/components/FormProps.ts'
import { ProfileResponse } from '@/features/profiles/Profile.type.ts'
import { ProfilesCombobox } from '@/features/profiles/components/profile-combobox.tsx'
import { useProfileByCopypointOperations } from '@/features/profiles/hooks/useProfiles.ts'
import { SaleProfileItem } from '@/features/saleprofile/components/input/sale-profile-item.tsx'
import useSaleProfiles from '@/features/saleprofile/hooks/useSaleProfiles.ts'
import { ServiceSelector } from '@/features/services/components/selector/service-selector.tsx'
import { useServiceContext } from '@/features/services/context/service-module-context.tsx'

type saleProfileInput =
  | 'profiles'
  | `profiles.${number}`
  | `profiles.${number}.profileId`
  | `profiles.${number}.quantity`

const formSchema = z.object({
  profiles: z.array(
    z.object({
      profileId: z.number().int(),
      serviceId: z.number().int(),
      quantity: z.number().int(),
    })
  ),
})

export type SaleProfilesFormValues = z.infer<typeof formSchema>

export interface SaleProfileFormProps extends FormProps<SaleProfilesFormValues> {
  isSubmitting?: boolean
}

export function SaleProfileForm({
                                  defaultValues = { profiles: [] },
                                  handleSubmit,
                                  isSubmitting = false,
                                }: SaleProfileFormProps) {
  const { currentService } = useServiceContext()
  const { profiles, isLoading: isLoadingProfiles } =
    useProfileByCopypointOperations()
  const { saleProfiles } = useSaleProfiles()

  // 1. Define your form.
  const form = useForm<SaleProfilesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // 4. Usar useFieldArray con el tipo explícito
  const profilesArray = useFieldArray({
    control: form.control,
    name: 'profiles',
  })

  const {
    NavigationGuardDialog,
    hasUnsavedChanges,
    markAsSaved,
    markAsChanged,
  } = useHookFormNavigationGuard(form)

  function handleOnProfileSelect(profile: ProfileResponse) {
    if (currentService) {
      const currentSelectedProfiles = form.getValues('profiles')
      const profileResult = currentSelectedProfiles.findIndex(
        (sp) => sp.profileId === profile.id
      )

      if (profileResult != -1) {
        const currentValue = form.getValues(
          `profiles.${profileResult}.quantity`
        )
        const newQuantity = currentValue + 1

        // Solo actualizar el formulario localmente
        form.setValue(`profiles.${profileResult}.quantity`, newQuantity)
        markAsChanged() // Marcar como modificado para la protección de navegación
        return
      }

      // Agregar nuevo perfil al formulario localmente
      profilesArray.append({
        profileId: profile.id,
        serviceId: currentService.id,
        quantity: 1,
      })
      markAsChanged() // Marcar como modificado para la protección de navegación
    }
  }

  function handleQuantityChange(
    profileId: number,
    serviceId: number,
    increment: number
  ) {
    const fieldIndex = form
      .watch('profiles')
      .findIndex(
        (field) =>
          field.profileId === profileId && field.serviceId === serviceId
      )

    if (fieldIndex === -1) return

    const currentValue = form.getValues(`profiles.${fieldIndex}.quantity`)
    const newValue = Math.max(1, currentValue + increment)

    // Solo actualizar el formulario localmente
    form.setValue(`profiles.${fieldIndex}.quantity`, newValue)
    markAsChanged() // Marcar como modificado para la protección de navegación
  }

  function handleRemoveProfile(profileId: number) {
    // Buscar el índice del perfil en el array de campos del formulario
    const fieldIndex = profilesArray.fields.findIndex(
      (field) => field.profileId === profileId
    )

    // Si se encuentra el perfil en el formulario, eliminarlo
    if (fieldIndex !== -1) {
      profilesArray.remove(fieldIndex)
      markAsChanged() // Marcar como modificado para la protección de navegación

      // Dar retroalimentación visual al usuario
      toast.info('Perfil eliminado del formulario')
    }
  }

  function handleValueChange(
    fieldName: string,
    _profileId: number,
    _serviceId: number,
    value: number
  ) {
    // Actualizar el formulario localmente y forzar re-render
    form.setValue(fieldName as saleProfileInput, value, {
      shouldDirty: true,    // Marca el campo como modificado
      shouldTouch: true,    // Marca el campo como tocado
      shouldValidate: true  // Activa la validación
    })

    // También podemos actualizar manualmente el estado del formulario
    form.trigger(fieldName as saleProfileInput)

    markAsChanged() // Marcar como modificado para la protección de navegación
  }

  // Función simplificada de envío
  async function onSubmit(values: SaleProfilesFormValues) {
    try {
      // Marcar el formulario como guardado para que no se active el diálogo de navegación
      markAsSaved()

      // Delegar la lógica de procesamiento al componente padre
      if (handleSubmit) {
        await handleSubmit(values)
      }
    } catch (error: any) {
      // El error ya se maneja en el componente padre, pero revertimos el estado
      markAsChanged()
      toast.error('Form submission error:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
        <div className='space-y-4'>
          <div className='text-xs font-semibold'>SERVICES</div>
          <ServiceSelector />

          <div className='text-xs font-semibold'>PROFILES</div>
          <ProfilesCombobox
            handleOnSelect={handleOnProfileSelect}
            profiles={profiles || []}
            disabled={isSubmitting || isLoadingProfiles}
          />
        </div>

        <Separator />

        {((saleProfiles && saleProfiles.length > 0) ||
          form.watch('profiles').length > 0) && (
          <div className='space-y-6'>
            {/* Obtener todos los servicios únicos de la API y del formulario */}
            {(() => {
              // Obtener servicios desde saleProfiles
              const apiServices = saleProfiles
                ? Array.from(new Set(saleProfiles.map((sp) => sp.service.name)))
                : []

              // Obtener IDs de servicios desde el formulario
              const formServiceIds = form
                .watch('profiles')
                .map((profile) => profile.serviceId)

              // Combinar servicios
              const allServices = apiServices

              // Agregar el servicio actual si tiene perfiles en el formulario y no está ya incluido
              if (
                currentService &&
                formServiceIds.includes(currentService.id) &&
                !apiServices.includes(currentService.name)
              ) {
                allServices.push(currentService.name)
              }

              return allServices
            })().map((serviceDescription) => (
              <div key={serviceDescription} className='space-y-3'>
                {/* Título del servicio */}
                <div className='text-xs font-semibold uppercase'>
                  {serviceDescription}
                </div>

                {/* Listar los perfiles que pertenecen a este servicio */}
                <ul className='space-y-2'>
                  {/* Mostrar perfiles existentes en la API */}
                  {saleProfiles &&
                    saleProfiles
                      .filter((sp) => sp.service.name === serviceDescription)
                      .map((sp) => {
                        const fieldIndex = form
                          .watch('profiles')
                          .findIndex(
                            (field) =>
                              field.profileId === sp.profileId &&
                              field.serviceId === sp.service.id
                          )

                        // Obtener la cantidad actual del formulario (si existe) o usar la cantidad de la API
                        const formQuantity =
                          fieldIndex !== -1
                            ? form.watch(`profiles.${fieldIndex}.quantity`)
                            : sp.quantity

                        // Determinar si el perfil ha sido modificado (cantidad diferente a la original)
                        const isModified =
                          fieldIndex !== -1 && formQuantity !== sp.quantity

                        return (
                          <SaleProfileItem
                            key={sp.profileId}
                            form={form}
                            fieldIndex={fieldIndex}
                            saleProfile={sp}
                            currentQuantity={formQuantity}
                            isModified={isModified}
                            handleRemoveProfile={handleRemoveProfile}
                            handleQuantityChange={handleQuantityChange}
                            handleValueChange={handleValueChange}
                          />
                        )
                      })}

                  {/* Mostrar perfiles nuevos que solo existen en el formulario */}
                  {(() => {
                    // Encontrar el servicio actual basado en el nombre de descripción
                    const serviceId =
                      currentService &&
                      currentService.name === serviceDescription
                        ? currentService.id
                        : null

                    if (!serviceId) return null

                    // Filtrar perfiles que están solo en el formulario (no en la API)
                    const newProfiles = form
                      .watch('profiles')
                      .filter((formProfile) => {
                        // Si no es del servicio actual, ignorar
                        if (formProfile.serviceId !== serviceId) return false

                        // Verificar si ya existe en la API
                        return !saleProfiles?.some(
                          (apiProfile) =>
                            apiProfile.profileId === formProfile.profileId &&
                            apiProfile.service.id === formProfile.serviceId
                        )
                      })

                    return newProfiles.map((newProfile) => {
                      // Buscar el perfil en la lista de perfiles disponibles
                      const profileData = profiles?.find(
                        (p) => p.id === newProfile.profileId
                      )
                      if (!profileData) return null

                      // Encontrar el índice en el formulario
                      const fieldIndex = form
                        .watch('profiles')
                        .findIndex(
                          (field) =>
                            field.profileId === newProfile.profileId &&
                            field.serviceId === serviceId
                        )

                      // Crear un objeto saleProfile temporal para mostrar
                      const tempSaleProfile = {
                        profileId: newProfile.profileId,
                        name: profileData.name,
                        description: profileData.description,
                        unitPrice: profileData.unitPrice,
                        quantity: newProfile.quantity,
                        service: {
                          id: serviceId,
                          name: serviceDescription,
                        },
                      }

                      return (
                        <div
                          key={`new-${newProfile.profileId}`}
                          className='relative'
                        >
                          <div className='absolute top-0 right-0 z-10 translate-x-1/2 -translate-y-1/2'>
                            <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
                              New
                            </span>
                          </div>
                          <SaleProfileItem
                            form={form}
                            fieldIndex={fieldIndex}
                            saleProfile={tempSaleProfile}
                            currentQuantity={newProfile.quantity}
                            isModified={true}
                            handleRemoveProfile={handleRemoveProfile}
                            handleQuantityChange={handleQuantityChange}
                            handleValueChange={handleValueChange}
                          />
                        </div>
                      )
                    })
                  })()}
                </ul>

                <Separator />
              </div>
            ))}
          </div>
        )}

        {hasUnsavedChanges && (
          <div className='flex items-center gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-600'>
            <span>⚠️</span>
            <div className='flex flex-col gap-1'>
              <span>
                You are viewing a preview of the changes. Profiles will only be
                created or updated when you click the submit button.
              </span>
              {saleProfiles && (
                <div className='text-xs'>
                  {(() => {
                    // Obtener los perfiles actuales en la API y en el formulario
                    const formProfiles = form.getValues('profiles')
                    const currentApiProfiles = saleProfiles

                    // Contar perfiles nuevos (no existen en la API)
                    const newProfilesCount = formProfiles.filter(
                      (fp) =>
                        !currentApiProfiles.some(
                          (ap) =>
                            ap.profileId === fp.profileId &&
                            ap.service.id === fp.serviceId
                        )
                    ).length

                    // Contar perfiles modificados (existen pero con valores diferentes)
                    const modifiedProfilesCount = formProfiles.filter((fp) => {
                      const apiProfile = currentApiProfiles.find(
                        (ap) =>
                          ap.profileId === fp.profileId &&
                          ap.service.id === fp.serviceId
                      )
                      return apiProfile && apiProfile.quantity !== fp.quantity
                    }).length

                    // Crear mensaje con el conteo
                    const parts = []
                    if (newProfilesCount > 0)
                      parts.push(
                        `${newProfilesCount} ${newProfilesCount === 1 ? 'new profile' : 'new profiles'}`
                      )
                    if (modifiedProfilesCount > 0)
                      parts.push(
                        `${modifiedProfilesCount} ${modifiedProfilesCount === 1 ? 'modified profile' : 'modified profiles'}`
                      )

                    return parts.length
                      ? `Pending changes: ${parts.join(' y ')}`
                      : null
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Renderizar explícitamente el diálogo de confirmación de navegación */}
        <NavigationGuardDialog />

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? 'Processing...'
            : hasUnsavedChanges
              ? 'Save'
              : 'Confirm'}
        </Button>
      </form>
    </Form>
  )
}