export interface Integration {
  id: string
  name: string
  description: string
  category: string
  status: "active" | "inactive" | "pending" | "error"
  isConfigured: boolean
  lastSync: Date
    provider?: any // Store the original API response data
  icon?: string
  metadata?: Record<string, any>
}

export interface IntegrationConfig {
  [key: string]: any
}

export interface IntegrationStats {
  totalTransactions?: number
  revenue?: number
  messagesSent?: number
  responseRate?: number
  [key: string]: any
}
