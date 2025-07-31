import { createFileRoute } from '@tanstack/react-router'
import IntegrationList from '@/features/copypoints/integrations/components/add-integration/integration-list.tsx'

export const Route = createFileRoute(
  '/_authenticated/copypoints/integrations/add/',
)({
  component: IntegrationList,
})

