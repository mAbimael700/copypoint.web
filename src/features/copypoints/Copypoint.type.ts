import { UserResponse } from "../user/User.type"

export type CopypointCreationDTO = {
    name: string
}

export type CopypointEditDTO = {

}

export interface CopypointResponse {
    id: number
    name: string
    responsible: UserResponse
    createdBy: UserResponse
    creationDate: string
    lastModified: string
}