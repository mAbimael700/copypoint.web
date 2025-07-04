import {useServiceByStoreOperations} from '@/features/services/hooks/useService.ts'
import type { Service } from '@/features/services/Service.type.ts'
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'

import { Button } from '@/components/ui/button.tsx'
import { ServiceCommand } from './service-command.tsx'
import { useEffect } from 'react'
import { useServiceContext } from '@/features/services/context/service-module-context.tsx'



export const ServiceSelector = () => {
    const { activeStore } = useStoreContext()
    const { services } = useServiceByStoreOperations(activeStore?.id || 0)
    const { currentService, setCurrentService } = useServiceContext()


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
