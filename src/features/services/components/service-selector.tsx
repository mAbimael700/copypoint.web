import useServices from '@/features/services/hooks/useService'
import type { Service } from '@/features/services/Service.type'
import { useStoreContext } from '@/features/stores/storage/useStoreContext'
import { useProfileModule } from '../../profiles/storage/ProfileStore'

import { Button } from '@/components/ui/button'
import { ServiceCommand } from './service-command'



export const ServiceSelector = () => {
    const { activeStore } = useStoreContext()
    const { services } = useServices(activeStore?.id || 0)
    const { currentService, setCurrentService } = useProfileModule()



    function handleOnClick(service: Service) {
        setCurrentService(service)
    }

    return (
        <div className='flex gap-4'>
            <div className=' bg-accent rounded-lg p-1 gap-2 flex'>

                {services.map(s =>
                    <Button className='h-7'
                        variant={currentService?.id == s.id ? "default" : "ghost"}
                        onClick={() => handleOnClick(s)}
                        key={"service-selector" + s.id}>
                        {s.name}
                    </Button>)}
            </div>

            <ServiceCommand
                label={
                    currentService
                        ? services.find((s) => s.name === currentService.name)?.name
                        : "Select profile..."}
                handleOnClick={handleOnClick} />

        </div>
    )
}
