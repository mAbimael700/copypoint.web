import Copypoints from '@/features/copypoints'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/copypoints/')({
  component: Copypoints,
})

