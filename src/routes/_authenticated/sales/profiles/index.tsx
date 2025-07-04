import { createFileRoute } from '@tanstack/react-router'
import MutateSaleProfile from '@/features/saleprofile/components/mutate-sale-profile.tsx'

export const Route = createFileRoute('/_authenticated/sales/profiles/')({
  component: MutateSaleProfile,
})


