import { createFileRoute } from '@tanstack/react-router'
import MutateMercadopagoConfig from '@/features/mercadopago-config/components/form/mutate-mercadopago-config.tsx'

export const Route = createFileRoute(
  '/_authenticated/copypoints/integrations/add/mercadopago-config',
)({
  component: MutateMercadopagoConfig,
})

