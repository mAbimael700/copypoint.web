import { Badge } from "@/components/ui/badge.tsx"
import { MessageCircle } from "lucide-react"
import { Integration } from '@/features/copypoints/integrations/types/integration.ts'

interface WhatsAppIntegrationProps {
  integration: Integration
}

// eslint-disable-next-line no-empty-pattern
export const WhatsAppIntegration = ({  }: WhatsAppIntegrationProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium">Business API</p>
          <p className="text-xs text-muted-foreground">Send notifications and customer support</p>
        </div>
      </div>

     {/* <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Messages sent:</span>
          <p className="font-medium">2,456</p>
        </div>
        <div>
          <span className="text-muted-foreground">Response rate:</span>
          <p className="font-medium">94%</p>
        </div>
      </div>*/}

      <div className="flex gap-1">
        <Badge variant="outline" className="text-xs">
          Notifications
        </Badge>
        <Badge variant="outline" className="text-xs">
          Support
        </Badge>
      </div>
    </div>
  )
}
