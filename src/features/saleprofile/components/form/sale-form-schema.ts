import { z } from "zod"

export const saleProfileFormSchema = z.object({
    profiles: z.array(z.object({
        profileId: z.number().int(),
        serviceId: z.number().int(),
        quantity: z.number().int()
    })),
})

export type SaleProfilesFormValues = z.infer<typeof saleProfileFormSchema>