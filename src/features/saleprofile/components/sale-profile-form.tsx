"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { ProfileResponse } from "@/features/profiles/Profile.type"
import { FormProps } from "@/components/FormProps"
import useProfileOperations from "@/features/profiles/hooks/useProfiles"
import { useStoreContext } from "@/features/stores/storage/useStoreContext"
import { formatCurrency } from "@/lib/utils.currency"

import { Button } from "@/components/ui/button"
import { ServiceSelector } from "@/features/services/components/service-selector"
import { Separator } from "@/components/ui/separator"
import { Form } from "@/components/ui/form"
import { ProfilesCombobox } from "@/features/profiles/components/profile-combobox"
import { X } from "lucide-react"
import { SaleProfileQuantityDrawer } from "./sale-profile-quantity-input"


const formSchema = z.object({
    profiles: z.array(z.object({
        profileId: z.number().int(),
        quantity: z.number().int()
    })),
})

export type SaleProfilesFormValues = z.infer<typeof formSchema>

export function SaleProfileForm({
    defaultValues = { profiles: [] },
    handleSubmit }: FormProps<SaleProfilesFormValues>) {
    const { activeStore } = useStoreContext()
    const { profiles } = useProfileOperations(activeStore?.id || 0)

    // 1. Define your form.
    const form = useForm<SaleProfilesFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    })
    // 4. Usar useFieldArray con el tipo explícito
    const profilesArray = useFieldArray({
        control: form.control,
        name: "profiles",
    });

    function handleOnProfileSelect(profile: ProfileResponse) {

        const currentSelectedProfiles = form.getValues('profiles')
        const profileResult = currentSelectedProfiles.findIndex(sp => sp.profileId === profile.id)

        if (profileResult != -1) {
            const currentValue = form.getValues(`profiles.${profileResult}.quantity`)
            return form.setValue(`profiles.${profileResult}.quantity`, currentValue + 1)
        }

        profilesArray.append({ profileId: profile.id, quantity: 1 })
    }


    function handleQuantityChange(profileId: number, increment: number) {
        const fieldIndex = profilesArray.fields.findIndex(field => field.profileId === profileId)
        if (fieldIndex === -1) return

        const currentValue = form.getValues(`profiles.${fieldIndex}.quantity`)
        const newValue = Math.max(1, currentValue + increment)
        form.setValue(`profiles.${fieldIndex}.quantity`, newValue)
    }

    function handleRemoveProfile(profileId: number) {
        const fieldIndex = profilesArray.fields.findIndex(field => field.profileId === profileId)
        if (fieldIndex !== -1) {
            profilesArray.remove(fieldIndex)
        }
    }

    function handleValueChange(fieldName: string, value: number) {
        form.setValue(fieldName as any, value)
    }

    const selectedProfiles = profiles
        .filter(pr => form.watch('profiles')
            .some(p => p.profileId === pr.id))

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <div className="text-xs font-semibold">SERVICES</div>
                    <ServiceSelector />

                    <div className="text-xs font-semibold">PROFILES</div>
                    <ProfilesCombobox
                        handleOnSelect={handleOnProfileSelect}
                    />
                </div>

                <Separator />

                {
                    selectedProfiles.length > 0 &&
                    <ul>
                        {selectedProfiles.map(sp => {
                            const fieldIndex = profilesArray.fields.findIndex(field => field.profileId === sp.id)
                            const currentQuantity = form.watch("profiles").find(field => field.profileId === sp.id)?.quantity || 1
                            return (
                                <li key={sp.id} className="py-2 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div>{sp.name}</div>
                                        <div className="text-sm text-muted-foreground">{formatCurrency(sp.unitPrice)}</div>
                                    </div>

                                    <div className="flex items-center gap-5">

                                        <SaleProfileQuantityDrawer
                                            profileId={sp.id}
                                            profileName={sp.name}
                                            currentQuantity={currentQuantity}
                                            fieldIndex={fieldIndex}
                                            control={form.control}
                                            onQuantityChange={handleQuantityChange}
                                            onValueChange={handleValueChange}
                                        />

                                        <Button
                                            type="button"
                                            size={"icon"}
                                            onClick={() => handleRemoveProfile(sp.id)}
                                            className="bg-muted-foreground hover:bg-destructive hover:border-destructive select-none text-muted text p-2.5 text-xs h-4 w-4  rounded-full justify-center border-background shadow-sm">
                                            <X size={10} />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>

                                </li>
                            )
                        })
                        }
                    </ul>
                }

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
