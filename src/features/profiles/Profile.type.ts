import { Service } from "../services/Service.type"

export interface ProfileResponse {
    id: number
    name: string
    description: string
    unitPrice: number
    createdAt: string
    modifiedAt: string
    status: boolean
    services: Service[]
}

export interface ProfileCreationDTO {
    name: string
    description: string
    unitPrice: number
    services: number[]
}