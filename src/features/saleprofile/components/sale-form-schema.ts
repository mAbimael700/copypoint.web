import { z } from "zod"

export const formSchema = z.object({
    profiles: z.array(z.object({
        profileId: z.number().int(),
        quantity: z.number().int()
    })),
})

export type SaleProfilesFormValues = z.infer<typeof formSchema>