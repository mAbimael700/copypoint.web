
import { useStoreContext } from '@/features/stores/storage/useStoreContext'
import { useServiceModule } from '../context/service-module-context'
import useServices from '../hooks/useService'
import { ServiceForm } from './service-form'
import { ServiceMutateDrawer } from './service-mutate-drawer'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { DeleteDialog } from '@/components/delete-dialog'

export function ServiceDialogs() {
  const { open, setOpen, currentService, setCurrentService } = useServiceModule()
  const { activeStore } = useStoreContext()
  const { createService } = useServices(activeStore?.id || 0)


  function saveService(values: ServiceForm) {
    createService(values);
  }

  function updateService(values: ServiceForm) {
    console.log(values);
    
  }


  return (
    <>
      <ServiceMutateDrawer
        key='service-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        service={{ name: "" }}
        onSubmit={saveService}
      />


      {currentService && (
        <>
          <ServiceMutateDrawer
            key={`service-update-${currentService.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentService(null)
              }, 500)
            }}
            service={currentService}
            onSubmit={updateService}
          />


          <DeleteDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentService(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentService(null)
              }, 500)
              showSubmittedData(
                currentService,
                'The following service has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this service: ${currentService.name} ?`}
            desc={
              <>
                You are about to delete service: <strong>{currentService.name}</strong> <br /> {' '}
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

