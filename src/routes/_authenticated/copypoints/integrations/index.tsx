import { createFileRoute } from '@tanstack/react-router'
import CopypointIntegrations from '@/features/copypoints/integrations'

export const Route = createFileRoute(
  '/_authenticated/copypoints/integrations/',
)({
  component: CopypointIntegrations,
})


