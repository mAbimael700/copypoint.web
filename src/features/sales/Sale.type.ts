import { PaymentMethod } from "../paymentmethod/PaymentMethod.type";
import { UserResponse } from "../user/User.type";

export interface SaleResponse {
    id: number
    userVendor: UserResponse
    paymentMethod: PaymentMethod
    total: number
    currency: CurrencyType
    status: SaleStatus
    discount: number
    createdAt: string
    updatedAt: string
}

export interface SaleCreationDTO {
    currency: CurrencyType
    paymentMethod: number
    profiles: SaleProfileCreationDTO[]
}

export interface SaleProfileCreationDTO {
    profileId: number
    quantity: number
}

enum CurrencyType {
    MXN
}

export enum SaleStatus {
    PENDING,        // Venta pendiente de procesamiento
    COMPLETED,      // Venta concretada/exitosamente finalizada
    PAYMENT_PENDING, // Pago pendiente (ej: venta aprobada pero falta pago)
    CANCELLED,      // Venta cancelada
    REFUNDED,       // Venta reembolsada
    ON_HOLD,        // Venta en espera (por revisión, etc)
    PARTIALLY_PAID,  // Pago parcial recibido
    FAILED,          // Venta fallida (ej: pago rechazado)
    EXPIRED
}