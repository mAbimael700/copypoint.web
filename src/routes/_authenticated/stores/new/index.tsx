import { CreateStoreForm } from '@/features/stores/components/form/create-store.form'
import { createFileRoute } from '@tanstack/react-router'

// Definir el tipo de los search params
type CreateStoreSearchParams = {
  context?: 'registration' | 'onboarding' | 'add-store' | 'default'
  from?: string
}
export const Route = createFileRoute('/_authenticated/stores/new/')({
  validateSearch: (search): CreateStoreSearchParams => {
    return {
      context: search.context as CreateStoreSearchParams['context'],
      from: search.from as string
    }
  },
  component: CreateStoreForm,
})

