//import { Badge } from "@/components/ui/badge"
import { Integration } from '@/features/copypoints/integrations/types/integration.ts'


interface MercadoPagoIntegrationProps {
  integration: Integration
}

// eslint-disable-next-line no-empty-pattern
export const MercadoPagoIntegration = ({ }: MercadoPagoIntegrationProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 font-bold text-sm">MP</span>
        </div>
        <div>
          <p className="text-sm font-medium">Checkout Integration</p>
          <p className="text-xs text-muted-foreground">Accept credit cards and digital payments</p>
        </div>
      </div>

      {/*<div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Transactions:</span>
          <p className="font-medium">1,234</p>
        </div>
        <div>
          <span className="text-muted-foreground">Revenue:</span>
          <p className="font-medium">$12,450</p>
        </div>
      </div>*/}

     {/* <div className="flex gap-1">
        <Badge variant="outline" className="text-xs">
          Credit Cards
        </Badge>
        <Badge variant="outline" className="text-xs">
          PIX
        </Badge>
      </div>*/}
    </div>
  )
}
