'use client'

import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button.tsx'
import { Form } from '@/components/ui/form.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { FormProps } from '@/components/FormProps.ts'
import { useCopypointContext } from '@/features/copypoints/storage/useCopypointStorage.ts'
import { ProfileResponse } from '@/features/profiles/Profile.type.ts'
import { ProfilesCombobox } from '@/features/profiles/components/profile-combobox.tsx'
import { useProfilesByCopypoint } from '@/features/profiles/hooks/useProfiles.ts'
import { SaleProfileItem } from '@/features/saleprofile/components/input/sale-profile-item.tsx'
import useCreateSaleProfileOperations from '@/features/saleprofile/hooks/useCreateSaleProfile.ts'
import useSaleProfiles from '@/features/saleprofile/hooks/useSaleProfiles.ts'
import { ServiceSelector } from '@/features/services/components/selector/service-selector.tsx'
import { useServiceContext } from '@/features/services/context/service-module-context.tsx'
import { useHookFormNavigationGuard } from '@/hooks/use-navigation-guard.tsx'

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

export function SaleProfileForm({
  defaultValues = { profiles: [] },
  handleSubmit,
}: FormProps<SaleProfilesFormValues>) {
  const { currentCopypoint } = useCopypointContext()
  const { currentService } = useServiceContext()
  const { data: profiles, isLoading: isLoadingProfiles } =
    useProfilesByCopypoint({
      copypointId: currentCopypoint?.id || 0,
    })
  const { saleProfiles } = useSaleProfiles()
  const { createSaleProfile, isCreating } = useCreateSaleProfileOperations()

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

  const { NavigationGuardDialog, hasUnsavedChanges } =
    useHookFormNavigationGuard(form)

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

        // Intentar crear/actualizar el SaleProfile mediante la API
        createSaleProfile({
          serviceId: currentService.id,
          profileId: profile.id,
          quantity: newQuantity,
        }).catch((error) => {
          // Si falla la API, mantenemos la UI actualizada
          throw toast.error('Error al actualizar perfil:', error)
        })

        // Actualizar el formulario
        form.setValue(`profiles.${profileResult}.quantity`, newQuantity)

        return
      }

      // Intentar crear el SaleProfile mediante la API
      createSaleProfile({
        profileId: profile.id,
        quantity: 1,
        serviceId: currentService.id,
      }).catch((error) => {
        // Si falla la API, mantenemos la UI actualizada
        throw toast.error('Error al agregar perfil:', error)
      })

      // Agregar nuevo perfil al formulario
      profilesArray.append({
        profileId: profile.id,
        serviceId: currentService.id,
        quantity: 1,
      })
    }
  }

  function handleQuantityChange(profileId: number, increment: number) {
    if (currentService) {
      const fieldIndex = profilesArray.fields.findIndex(
        (field) => field.profileId === profileId
      )
      if (fieldIndex === -1) return

      const currentValue = form.getValues(`profiles.${fieldIndex}.quantity`)
      const newValue = Math.max(1, currentValue + increment)

      // Actualizar el formulario
      form.setValue(`profiles.${fieldIndex}.quantity`, newValue)

      // Intentar actualizar el SaleProfile mediante la API
      createSaleProfile({
        profileId: profileId,
        serviceId: currentService.id,
        quantity: newValue,
      }).catch((error) => {
        // Si falla la API, mantenemos la UI actualizada
        throw toast.error('Error al actualizar cantidad del perfil:', error)
      })
    }
  }

  function handleRemoveProfile(profileId: number) {
    const fieldIndex = profilesArray.fields.findIndex(
      (field) => field.profileId === profileId
    )
    if (fieldIndex !== -1) {
      profilesArray.remove(fieldIndex)
    }
  }

  function handleValueChange(fieldName: string, value: number) {
    form.setValue(fieldName as saleProfileInput, value)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8 w-full'>
        <div className='space-y-4'>
          <div className='text-xs font-semibold'>SERVICES</div>
          <ServiceSelector />

          <div className='text-xs font-semibold'>PROFILES</div>
          <ProfilesCombobox
            handleOnSelect={handleOnProfileSelect}
            profiles={profiles || []}
            disabled={isCreating || isLoadingProfiles}
          />
          {isCreating && (
            <div className='text-muted-foreground animate-pulse text-xs'>
              Actualizando perfiles...
            </div>
          )}
        </div>

        <Separator />

        {saleProfiles && saleProfiles.length > 0 && (
          <div className="space-y-6">
            {/* Agrupar los perfiles por servicio */}
            {Array.from(
              // Crear un Set con las descripciones únicas de servicio
              new Set(saleProfiles.map(sp => sp.service.name))
            ).map(serviceDescription => (
              <div key={serviceDescription} className="space-y-3">
                {/* Título del servicio */}
                <div className='text-xs font-semibold uppercase'>{serviceDescription}</div>

                {/* Listar los perfiles que pertenecen a este servicio */}
                <ul className="space-y-2">
                  {saleProfiles
                    .filter(sp => sp.service.name === serviceDescription)
                    .map((sp) => {
                      const fieldIndex = profilesArray.fields.findIndex(
                        (field) => field.profileId === sp.profileId
                      )
                      const currentQuantity =
                        form
                          .watch('profiles')
                          .find(
                            (field) =>
                              field.profileId === sp.profileId &&
                              field.serviceId === sp.service.id
                          )?.quantity || 1

                      return (
                        <SaleProfileItem
                          key={sp.profileId}
                          form={form}
                          fieldIndex={fieldIndex}
                          saleProfile={sp}
                          currentQuantity={currentQuantity}
                          handleRemoveProfile={handleRemoveProfile}
                          handleQuantityChange={handleQuantityChange}
                          handleValueChange={handleValueChange}
                        />
                      )
                    })}
                </ul>

                <Separator />
              </div>
            ))}
          </div>
        )}

        {hasUnsavedChanges && (
          <div className='flex items-center gap-2 text-sm text-amber-600'>
            <span>⚠️</span>
            <span>Tienes cambios sin guardar</span>
          </div>
        )}
        <NavigationGuardDialog />

        <Button type='submit' disabled={isCreating}>
          {isCreating ? 'Procesando...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
