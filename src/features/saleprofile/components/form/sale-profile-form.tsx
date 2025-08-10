'use client';

import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useHookFormNavigationGuard } from '@/hooks/use-navigation-guard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Form } from '@/components/ui/form.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { FormProps } from '@/components/FormProps.ts';
import { ProfileResponse } from '@/features/profiles/Profile.type.ts';
import { ProfilesCombobox } from '@/features/profiles/components/profile-combobox.tsx';
import { useProfileByCopypointOperations } from '@/features/profiles/hooks/useProfiles.ts';
import { SaleProfileItem } from '@/features/saleprofile/components/input/sale-profile-item.tsx';
import useCreateSaleProfileOperations from '@/features/saleprofile/hooks/useCreateSaleProfile.ts';
import useSaleProfiles from '@/features/saleprofile/hooks/useSaleProfiles.ts';
import { ServiceSelector } from '@/features/services/components/selector/service-selector.tsx';
import { useServiceContext } from '@/features/services/context/service-module-context.tsx';


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
  const { currentService } = useServiceContext()
  const { profiles, isLoading: isLoadingProfiles } = useProfileByCopypointOperations()
  const { saleProfiles } = useSaleProfiles()
  const { createSaleProfile, updateSaleProfile, isCreating, refetchSales } =
    useCreateSaleProfileOperations()

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

      const { NavigationGuardDialog, hasUnsavedChanges, markAsSaved, markAsChanged } =
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
    // Solo actualizar el formulario localmente
    form.setValue(fieldName as saleProfileInput, value)
    markAsChanged() // Marcar como modificado para la protección de navegación
  }

    // Function to handle form submission and update all profiles
      async function onSubmit(values: SaleProfilesFormValues) {

        try {
      // Obtener los perfiles actuales en la API
      const currentApiProfiles = saleProfiles || []

      // Clasificar los perfiles del formulario
      const formProfiles = values.profiles

      // Perfiles que necesitan ser creados (no existen en la API)
      const profilesToCreate = formProfiles.filter(formProfile => {
        return !currentApiProfiles.some(apiProfile => 
          apiProfile.profileId === formProfile.profileId && 
          apiProfile.service.id === formProfile.serviceId
        )
      })

      // Perfiles que necesitan ser actualizados (existen pero con valores diferentes)
      const profilesToUpdate = formProfiles.filter(formProfile => {
        const apiProfile = currentApiProfiles.find(ap => 
          ap.profileId === formProfile.profileId && 
          ap.service.id === formProfile.serviceId
        )
        return apiProfile && apiProfile.quantity !== formProfile.quantity
      })

      // Crear nuevos perfiles
      const createPromises = profilesToCreate.map(profile => {
        return createSaleProfile({
          profileId: profile.profileId,
          serviceId: profile.serviceId,
          quantity: profile.quantity
        })
      })

      // Actualizar perfiles existentes
      const updatePromises = profilesToUpdate.map(profile => {
        return updateSaleProfile(profile.profileId, profile.serviceId, {
          quantity: profile.quantity
        })
      })

      // Ejecutar todas las operaciones
      await Promise.all([...createPromises, ...updatePromises])
      await refetchSales()

      const createdCount = profilesToCreate.length
      const updatedCount = profilesToUpdate.length
      let message = ''

      if (createdCount > 0 && updatedCount > 0) {
        message = `${createdCount} perfiles creados y ${updatedCount} actualizados correctamente`
      } else if (createdCount > 0) {
        message = `${createdCount} perfiles creados correctamente`
      } else if (updatedCount > 0) {
        message = `${updatedCount} perfiles actualizados correctamente`
      } else {
        message = 'No se realizaron cambios en los perfiles'
      }

      toast.success(message)

      // Marcar el formulario como guardado para que no se active el diálogo de navegación
      markAsSaved()

      // Llamar al manejador de envío proporcionado como prop
      if (handleSubmit) {
        handleSubmit(values)
      }
    } catch (error: any) {
      toast.error(`Error al procesar perfiles: ${error.message}`)
    }
      }

      return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-8'
      >
        <div className='space-y-4'>
          <div className='text-xs font-semibold'>SERVICES</div>
          <ServiceSelector />

          <div className='text-xs font-semibold'>PROFILES</div>
          <ProfilesCombobox
            handleOnSelect={handleOnProfileSelect}
            profiles={profiles || []}
            disabled={isCreating || isLoadingProfiles}
          />
        </div>

        <Separator />

        {saleProfiles && saleProfiles.length > 0 && (
          <div className='space-y-6'>
            {/* Agrupar los perfiles por servicio */}
            {Array.from(
              // Crear un Set con las descripciones únicas de servicio
              new Set(saleProfiles.map((sp) => sp.service.name))
            ).map((serviceDescription) => (
              <div key={serviceDescription} className='space-y-3'>
                {/* Título del servicio */}
                <div className='text-xs font-semibold uppercase'>
                  {serviceDescription}
                </div>

                {/* Listar los perfiles que pertenecen a este servicio */}
                <ul className='space-y-2'>
                  {saleProfiles
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
                                              const formQuantity = fieldIndex !== -1 
                        ? form.watch(`profiles.${fieldIndex}.quantity`) 
                        : sp.quantity

                        // Determinar si el perfil ha sido modificado (cantidad diferente a la original)
                        const isModified = fieldIndex !== -1 && formQuantity !== sp.quantity

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
                </ul>

                <Separator />
              </div>
            ))}
          </div>
        )}

        {hasUnsavedChanges && (
          <div className='flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md'>
            <span>⚠️</span>
            <div className="flex flex-col gap-1">
              <span>Estás viendo una vista previa de los cambios. Los perfiles se crearán o actualizarán únicamente cuando hagas clic en el botón de envío.</span>
              {saleProfiles && (
                <div className="text-xs">
                  {(() => {
                    // Obtener los perfiles actuales en la API y en el formulario
                    const formProfiles = form.getValues('profiles');
                    const currentApiProfiles = saleProfiles;

                    // Contar perfiles nuevos (no existen en la API)
                    const newProfilesCount = formProfiles.filter(fp => 
                      !currentApiProfiles.some(ap => ap.profileId === fp.profileId && ap.service.id === fp.serviceId)
                    ).length;

                    // Contar perfiles modificados (existen pero con valores diferentes)
                    const modifiedProfilesCount = formProfiles.filter(fp => {
                      const apiProfile = currentApiProfiles.find(ap => 
                        ap.profileId === fp.profileId && ap.service.id === fp.serviceId
                      );
                      return apiProfile && apiProfile.quantity !== fp.quantity;
                    }).length;

                    // Crear mensaje con el conteo
                    const parts = [];
                    if (newProfilesCount > 0) parts.push(`${newProfilesCount} ${newProfilesCount === 1 ? 'perfil nuevo' : 'perfiles nuevos'}`);
                    if (modifiedProfilesCount > 0) parts.push(`${modifiedProfilesCount} ${modifiedProfilesCount === 1 ? 'perfil modificado' : 'perfiles modificados'}`);

                    return parts.length ? `Cambios pendientes: ${parts.join(' y ')}` : null;
                  })()} 
                </div>
              )}
            </div>
          </div>
        )}

        {/* Renderizar explícitamente el diálogo de confirmación de navegación */}
        <NavigationGuardDialog />

        <Button type='submit' disabled={isCreating}>
          {isCreating ? 'Procesando...' : hasUnsavedChanges ? 'Guardar Cambios en Perfiles' : 'Confirmar Perfiles'}
        </Button>
      </form>
    </Form>
  )
}
