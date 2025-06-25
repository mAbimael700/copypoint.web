import Services from '@/features/services'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/services/')({
    component: Services,
})

