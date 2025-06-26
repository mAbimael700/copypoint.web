import { Table } from "@tanstack/react-table";
import { ProfileResponse } from "../Profile.type";
import { ServiceSelector } from '../../services/components/service-selector'

export function ProfileHeader(_: Table<ProfileResponse>) {
    return <>
        <ServiceSelector />
    </>
}