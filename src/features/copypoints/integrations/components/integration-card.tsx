import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Settings, BarChart3, Trash2, Power } from "lucide-react"
import { Integration } from '@/features/copypoints/integrations/types/integration.ts'
import { IntegrationStatus } from '@/features/copypoints/integrations/components/integration-status.tsx'


interface IntegrationCardProps {
  integration: Integration
  customContent?: React.ReactNode
}

export const IntegrationCard = ({ integration, customContent }: IntegrationCardProps) => {
  const formatLastSync = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    )
  }

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{integration.name}</CardTitle>
            <CardDescription>{integration.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Power className="h-4 w-4 mr-2" />
                {integration.status === "active" ? "Disable" : "Enable"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{integration.category}</Badge>
          <IntegrationStatus status={integration.status} />
        </div>
      </CardHeader>

      <CardContent>
        {customContent || (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Last synchronized: {formatLastSync(integration.lastSync)}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
        <Button size="sm" className="flex-1">
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </CardFooter>
    </Card>
  )
}
