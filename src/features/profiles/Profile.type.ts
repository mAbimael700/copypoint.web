export interface ProfileResponse {
    id: number
    name: string
    description: string
    unitPrice: number
    createdAt: string
    modifiedAt: string
    status: boolean
}

export interface ProfileCreationDTO {
    name: string
    description: string
    unitPrice: number
    services: number[]
}