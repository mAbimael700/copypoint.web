import { Newspaper } from 'lucide-react'
import { Service } from '../Service.type'
import { ServiceActions } from './service-actions'
import { Badge } from '@/components/ui/badge'

export const ServiceCard = ({ service }: { service: Service }) => {
    return (
        <li
            className='rounded-lg border p-4 hover:shadow-md'
        >
            <div className='mb-8 flex items-center justify-between'>
                <div
                    className={`bg-muted flex size-10 items-center justify-center rounded-lg p-2`}
                >
                    <Newspaper />
                </div>
                <ServiceActions service={service} />
            </div>
            <div>
                <h2 className='mb-1 font-semibold'>{service.name}</h2>
                <Badge className='line-clamp-2 '>
                    {service.status ? "Habilitado" : "Inhabilitado"}
                </Badge>
            </div>
        </li>
    )
}
