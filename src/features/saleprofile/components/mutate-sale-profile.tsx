import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import FormLayout from '@/components/layout/form-layout.tsx'
import {
  SaleProfileForm,
  SaleProfilesFormValues,
} from '@/features/saleprofile/components/form/sale-profile-form.tsx'
import useSaleProfiles from '@/features/saleprofile/hooks/useSaleProfiles.ts'
import useCreateSaleProfileOperations from '@/features/saleprofile/hooks/useCreateSaleProfile.ts'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext.ts'

const MutateSaleProfile = () => {
  const { currentSale } = useSaleContext()
  const { saleProfiles } = useSaleProfiles()
  const { createSaleProfile, updateSaleProfile, isCreating, refetchSales } = useCreateSaleProfileOperations()
  const navigate = useNavigate()

  // Lógica de procesamiento de perfiles extraída del formulario
  async function handleSaleProfileSubmit(values: SaleProfilesFormValues): Promise<void> {
    try {
      // Obtener los perfiles actuales en la API
      const currentApiProfiles = saleProfiles || []
      const formProfiles = values.profiles

      // Perfiles que necesitan ser creados (no existen en la API)
      const profilesToCreate = formProfiles.filter((formProfile) => {
        return !currentApiProfiles.some(
          (apiProfile) =>
            apiProfile.profileId === formProfile.profileId &&
            apiProfile.service.id === formProfile.serviceId
        )
      })

      // Perfiles que necesitan ser actualizados (existen pero con valores diferentes)
      const profilesToUpdate = formProfiles.filter((formProfile) => {
        const apiProfile = currentApiProfiles.find(
          (ap) =>
            ap.profileId === formProfile.profileId &&
            ap.service.id === formProfile.serviceId
        )
        return apiProfile && apiProfile.quantity !== formProfile.quantity
      })

      // Crear nuevos perfiles
      const createPromises = profilesToCreate.map((profile) => {
        return createSaleProfile({
          profileId: profile.profileId,
          serviceId: profile.serviceId,
          quantity: profile.quantity,
        })
      })

      // Actualizar perfiles existentes
      const updatePromises = profilesToUpdate.map((profile) => {
        return updateSaleProfile(profile.profileId, profile.serviceId, {
          quantity: profile.quantity,
        })
      })

      // Ejecutar todas las operaciones
      await Promise.all([...createPromises, ...updatePromises])
      await refetchSales()

      // Mostrar mensaje de éxito
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

      // Opcional: navegar de vuelta o hacer alguna acción post-submit
      // await navigate({ to: '/sales' })

    } catch (error: any) {
      console.error('Error al procesar perfiles:', error)
      toast.error(`Error al procesar perfiles: ${error.message}`)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function handleBack() {
    if (!currentSale) {
      await navigate({ to: '/sales' })
    }
  }

  React.useEffect(() => {
    handleBack()
  }, [currentSale, handleBack])

  return (
    <FormLayout
      header={'Add profiles to sale #' + currentSale?.id}
      description={'Add profiles to sale'}
      className={'w-full'}
    >
      <SaleProfileForm
        defaultValues={{
          profiles: saleProfiles?.map((sp) => ({
            serviceId: sp.service.id,
            profileId: sp.profileId,
            quantity: sp.quantity,
          })) || [],
        }}
        handleSubmit={handleSaleProfileSubmit}
        isSubmitting={isCreating}
      />
    </FormLayout>
  )
}

export default MutateSaleProfile