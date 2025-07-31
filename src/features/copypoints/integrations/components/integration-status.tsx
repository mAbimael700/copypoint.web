import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface IntegrationStatusProps {
  status: "active" | "inactive" | "pending" | "error"
}

export const IntegrationStatus = ({ status }: IntegrationStatusProps) => {
  const statusConfig = {
    active: {
      label: "Active",
      variant: "default" as const,
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    inactive: {
      label: "Inactive",
      variant: "secondary" as const,
      icon: XCircle,
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
    pending: {
      label: "Pending",
      variant: "outline" as const,
      icon: Clock,
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    error: {
      label: "Error",
      variant: "destructive" as const,
      icon: AlertCircle,
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
