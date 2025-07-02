import {useServiceByStoreOperations} from '@/features/services/hooks/useService'
import type { Service } from '@/features/services/Service.type'
import { useStoreContext } from '@/features/stores/storage/useStoreContext'
import { useProfileModule } from '../../profiles/storage/ProfileStore'

import { Button } from '@/components/ui/button'
import { ServiceCommand } from './service-command'
import { useEffect } from 'react'



export const ServiceSelector = () => {
    const { activeStore } = useStoreContext()
    const { services } = useServiceByStoreOperations(activeStore?.id || 0)
    const { currentService, setCurrentService } = useProfileModule()


    function handleOnClickBtn(service: Service, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault()
        setCurrentService(service)
    }
    function handleOnClick(service: Service) {
        setCurrentService(service)
    }

    // Mostrar solo los primeros 4 servicios en los botones
    const visibleServices = services.slice(0, 4)

    // Seleccionar automáticamente el primer servicio si no hay uno seleccionado
    useEffect(() => {
        if (!currentService && services.length > 0) {
            setCurrentService(services[0])
        }
    }, [currentService, services, setCurrentService])

    return (
        <div className='flex gap-4'>
            <div className=' bg-accent rounded-lg p-1 gap-1 flex'>

                {visibleServices.map(s =>
                    <Button className='h-7'
                        variant={currentService?.id == s.id ? "default" : "ghost"}
                        onClick={(e) => handleOnClickBtn(s, e)}
                        key={"service-selector" + s.id}>
                        {s.name}
                    </Button>)}
            </div>

            <ServiceCommand
                label={
                    currentService
                        ? services.find((s) => s.name === currentService.name)?.name
                        : "Select profile..."}
                handleOnClick={(s) => { handleOnClick(s) }} />

        </div>
    )
}
