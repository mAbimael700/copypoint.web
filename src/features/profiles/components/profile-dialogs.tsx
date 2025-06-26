import { useStoreContext } from '@/features/stores/storage/useStoreContext'
import { useProfileModule } from '../storage/ProfileStore'
import useProfileOperations from '../hooks/useProfiles'

import { ProfileForm } from './profile-form'
import { ProfileMutateDrawer } from './profile-mutate-drawer'
import { DeleteDialog } from '@/components/delete-dialog'
import { showSubmittedData } from '@/utils/show-submitted-data'

export function ProfileDialogs() {
  const { activeStore } = useStoreContext()
  const { open, currentService, currentProfile, closeDialog } = useProfileModule()
  const { createProfile } = useProfileOperations(activeStore?.id || 0)


  function saveProfile(values: ProfileForm) {
    createProfile(values)
    closeDialog()
  }

  function updateService(values: ProfileForm) {
    console.log(values);
    closeDialog()
  }

  function handleDeleteConfirm() {
    // Lógica de eliminación
    showSubmittedData(
      currentService,
      'The following service has been deleted:'
    )
    closeDialog() // Cerrar dialog y limpiar estado
  }


  function handleCloseDialog(isOpen: boolean) {
    if (!isOpen) {
      closeDialog() // Usar closeDialog en lugar de setOpen
    }
  }

  return (
    <>
      <ProfileMutateDrawer
        key='profile-create'
        open={open === 'create'}
        onOpenChange={handleCloseDialog}
        onSubmit={saveProfile}
      />


      {currentProfile && (
        <>
          <ProfileMutateDrawer
            key={`profile-update-${currentProfile.id}`}
            open={open === 'update'}
            onOpenChange={handleCloseDialog}
            profile={{ ...currentProfile, services: currentProfile.services.map(s => s.id) }}
            onSubmit={updateService}
          />


          <DeleteDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={handleCloseDialog}
            handleConfirm={handleDeleteConfirm}
            className='max-w-md'
            title={`Delete this service: ${currentProfile.name} ?`}
            desc={
              <>
                You are about to delete service: <strong>{currentProfile.name}</strong> <br /> {' '}
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}

