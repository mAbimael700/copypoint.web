import { toast } from 'sonner'
import FormLayout from '@/components/layout/form-layout.tsx'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext.ts'
import { useSalesOperations } from '@/features/sales/hooks/useSales.ts'
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'
import { SaleForm } from './sale-form.tsx'
import { useNavigate } from '@tanstack/react-router'

export const CreateSaleForm = () => {
  type SaleForm = {
    currency: string
    paymentMethodId: number
  }
  const { activeStore } = useStoreContext()
  const { setCurrentSale } = useSaleContext()
  const createSale = useSalesOperations().createSale
  const navigate = useNavigate()

  async function onHandleSubmit(values: SaleForm): Promise<void> {
    const savedSale = await createSale(values)
    toast.success('Sale created successfully')
    setCurrentSale(savedSale)
    await navigate({ to: '/sales/profiles' })
  }

  return (
    <FormLayout
      description='Create a new copypoint sale'
      header='Register sale'
      className='gap-5'
    >
      <div>
        <SaleForm
          defaultValues={{
            currency: activeStore?.currency || '',
            paymentMethodId: 1,
          }}
          handleSubmit={onHandleSubmit}
        />
      </div>
    </FormLayout>
  )
}
