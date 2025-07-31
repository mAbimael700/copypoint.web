import { Integration } from '@/features/copypoints/integrations/types/integration.ts'
import { MercadoPagoIntegration } from '@/features/copypoints/integrations/mercado-pago/mercado-pago-integration.tsx'
import { IntegrationCard } from '@/features/copypoints/integrations/components/integration-card.tsx'
import { WhatsAppIntegration } from '@/features/copypoints/integrations/whatsapp-business/whatsapp-bussiness-integration.tsx'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import useIntegrations from '@/features/copypoints/integrations/hooks/useIntegrations'
import { Skeleton } from '@/components/ui/skeleton'

export const IntegrationsGrid = () => {
  const { currentCopypoint } = useCopypointContext()
  const { summary, isLoading, isError } = useIntegrations(currentCopypoint?.id || '')

  // Combine payment and messaging integrations
  const integrations: Integration[] = [
    ...(summary?.paymentIntegrations || []).map(integration => ({
      id: `payment-${integration.id}`,
      name: integration.displayName,
      description: `${integration.providerName} payment integration`,
      category: 'Payment',
      status: integration.isActive ? 'active' : 'inactive',
      lastSync: new Date(integration.updatedAt),
      // Add other needed properties
      provider: integration
    })),
    ...(summary?.messagingIntegrations || []).map(integration => ({
      id: `messaging-${integration.id}`,
      name: integration.displayName,
      description: `${integration.providerName} messaging integration`,
      category: 'Messaging',
      status: integration.isActive ? 'active' : 'inactive',
      lastSync: new Date(integration.updatedAt),
      // Add other needed properties
      provider: integration
    }))
  ]

  const renderIntegrationComponent = (integration: Integration) => {
    // Determine which component to render based on provider type
    if (integration.category === 'Payment') {
      return <MercadoPagoIntegration integration={integration} />
    } else if (integration.category === 'Messaging') {
      return <WhatsAppIntegration integration={integration} />
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Failed to load integrations
      </div>
    )
  }

  if (integrations.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        No integrations found for this copypoint
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          customContent={renderIntegrationComponent(integration)}
        />
      ))}
    </div>
  )
}
