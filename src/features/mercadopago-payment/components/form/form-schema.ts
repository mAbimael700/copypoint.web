import { z } from 'zod'

export const payerSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  phone: z.string().min(10).max(15),
  identification: z.string().min(10).max(20),
  identficationType: z.string().min(2).max(255),
  email: z.string().email(),
})

export const formSchema = z.object({
  saleId: z.number().int().positive(),
  description: z.string().min(2).max(255),
  amount: z.number().int().positive(),
  currency: z.string().min(3).max(3),
  payerSchema,
})

export type FormSchema = z.infer<typeof formSchema>