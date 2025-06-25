import { createFileRoute } from '@tanstack/react-router'
import Users from '@/features/user'

export const Route = createFileRoute('/_authenticated/users/')({
  component: Users,
})
