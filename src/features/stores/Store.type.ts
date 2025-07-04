import { UserResponse } from "../user/User.type"


export interface Store {
    id: number
    name: string
    createdAt: string
}

export interface StoreCreationDTO {
    name: string
    currency: string
}

export type StoreResponse = Store & {
    owner: UserResponse;
    currency: string;
};