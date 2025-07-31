import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Zap } from "lucide-react"
import { useCopypointContext } from "@/features/copypoints/context/useCopypointContext"
import useIntegrations from "@/features/copypoints/integrations/hooks/useIntegrations"
import { Skeleton } from "@/components/ui/skeleton"

export const IntegrationsStats = () => {
  const { currentCopypoint } = useCopypointContext()
  const { stats, isLoading, isError } = useIntegrations(currentCopypoint?.id || '')

  // Stats configuration with dynamic data
  const statsConfig = [
    {
      title: "Active Integrations",
      value: stats?.activeIntegrations || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Inactive",
      value: (stats?.totalIntegrations || 0) - (stats?.activeIntegrations || 0),
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Payment Providers",
      value: stats?.paymentProvidersCount || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Messaging Providers",
      value: stats?.messagingProvidersCount || 0,
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  if (isError) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Failed to load integration statistics
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
