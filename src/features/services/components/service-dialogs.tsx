
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'
import { useServiceContext } from '../context/service-module-context'
import { useServiceByStoreOperations } from '../hooks/useService'
import { ServiceForm } from './service-form'
import { ServiceMutateDrawer } from './service-mutate-drawer'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { DeleteDialog } from '@/components/delete-dialog'

export function ServiceDialogs() {
  const { open, currentService, closeDialog } = useServiceContext() // Usando el store de Zustand
  const { activeStore } = useStoreContext()
  const { createService } = useServiceByStoreOperations(activeStore?.id || 0)

  function saveService(values: ServiceForm) {
    createService(values);
    closeDialog(); // Cerrar después de crear
  }

  function updateService(values: ServiceForm) {
    console.log(values);
    closeDialog(); // Cerrar después de actualizar
  }

  function handleDeleteConfirm() {
    if (currentService) {
      showSubmittedData(
        currentService,
        'The following service has been deleted:'
      )
    }
    closeDialog(); // Cerrar después de eliminar
  }

  return (
    <>
      <ServiceMutateDrawer
        key='service-create'
        open={open === 'create'}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeDialog()
        }}
        service={{ name: ""}}
        onSubmit={saveService}
      />

      {currentService && (
        <>
          <ServiceMutateDrawer
            key={`service-update-${currentService.id}`}
            open={open === 'update'}
            onOpenChange={(isOpen) => {
              if (!isOpen) closeDialog()
            }}
            service={currentService}
            onSubmit={updateService}
          />

          <DeleteDialog
            key='service-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (!isOpen) closeDialog()
            }}
            handleConfirm={handleDeleteConfirm}
            className='max-w-md'
            title={`Delete this service: ${currentService.name}?`}
            desc={
              <>
                You are about to delete service: <strong>{currentService.name}</strong>
                <br />
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

