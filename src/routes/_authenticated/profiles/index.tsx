import Profiles from '@/features/profiles'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profiles/')({
  component: Profiles,
})

