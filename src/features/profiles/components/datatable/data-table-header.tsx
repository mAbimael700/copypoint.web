import { Table } from "@tanstack/react-table";
import { ProfileResponse } from "../../Profile.type.ts";
import { ServiceSelector } from '../../../services/components/selector/service-selector.tsx'

export function ProfileHeader(_: Table<ProfileResponse>) {
    return <>
        <ServiceSelector />
    </>
}