import { Main } from '@/components/layout/main.tsx'
import { IntegrationsHeader } from '@/features/copypoints/integrations/components/integration-header.tsx'
import { IntegrationsGrid } from '@/features/copypoints/integrations/components/integrations-grid.tsx'
import { IntegrationsStats } from '@/features/copypoints/integrations/components/integrations-stats.tsx'


const CopypointIntegrations = () => {


  return (
    <Main>
      <div className="space-y-6">
        <IntegrationsHeader />
        <IntegrationsStats />
        <IntegrationsGrid />
      </div>
    </Main>
  )
}

export default CopypointIntegrations
