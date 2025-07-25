import { SaleStatus } from '@/features/sales/Sale.type.ts'
import { PaymentMethod } from '@/features/paymentmethod/PaymentMethod.type.ts'

export const getStatusBadgeVariant = (status: SaleStatus) => {
  switch (status) {
    case SaleStatus.COMPLETED:
      return "default"
    case SaleStatus.PENDING:
      return "secondary"
    case SaleStatus.CANCELLED:
      return "destructive"
    default:
      return "outline"
  }
}

export const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method.description) {
    case "CASH":
      return "Efectivo"
    case "CARD":
      return "Tarjeta"
    case "TRANSFER":
      return "Transferencia"
    default:
      return method.description
  }
}

// Función para traducir el estado
export const getStatusLabel = (status: SaleStatus) => {
  switch (status) {
    case SaleStatus.COMPLETED:
      return "Completada"
    case SaleStatus.PENDING:
      return "Pendiente"
    case SaleStatus.CANCELLED:
      return "Cancelada"
    default:
      return status
  }
}