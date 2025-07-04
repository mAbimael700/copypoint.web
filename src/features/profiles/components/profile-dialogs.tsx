import { showSubmittedData } from '@/utils/show-submitted-data';
import { DeleteDialog } from '@/components/delete-dialog';
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts';
import useProfileOperations from '../hooks/useProfiles';
import { useProfileModule } from '@/features/profiles/context/ProfileStore';
import { ProfileForm } from './form/profile-form.tsx';
import { ProfileMutateDrawer } from './profile-mutate-drawer';


export function ProfileDialogs() {
  const { activeStore } = useStoreContext()
  const { open, currentService, currentProfile, closeDialog } = useProfileModule()
  const { createProfile } = useProfileOperations(activeStore?.id || 0)


  async function saveProfile(values: ProfileForm) {
    await createProfile(values)
    closeDialog()
  }

  function updateService(_: ProfileForm) {
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
