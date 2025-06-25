import CopypointCreateForm from '@/features/copypoints/components/copypoint-create-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/copypoints/create')({
  component: CopypointCreateForm,
})

