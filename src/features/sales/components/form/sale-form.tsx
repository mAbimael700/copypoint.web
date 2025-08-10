import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useHookFormNavigationGuard } from '@/hooks/use-navigation-guard.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { FormProps } from '@/components/FormProps.ts';
import { CopypointResponse } from '@/features/copypoints/Copypoint.type.ts';
import { CopypointCombobox } from '@/features/copypoints/components/copypoint-combobox.tsx';
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts';
import { CurrencyCombobox } from '@/features/currency/components/currency-combobox.tsx';
import { PaymentMethod } from '@/features/paymentmethod/PaymentMethod.type.ts';
import { PaymentMethodsCombobox } from '@/features/paymentmethod/components/payment-method-command.tsx';


const formSchema = z.object({
  currency: z.string().length(3, 'Name is required.'),
  paymentMethodId: z.number().positive(),
})

export type SaleForm = z.infer<typeof formSchema>

export const SaleForm = ({
  defaultValues = { currency: '', paymentMethodId: 0 },
  handleSubmit,
}: FormProps<SaleForm>) => {
  const { setCurrentCopypoint } = useCopypointContext()

  const form = useForm<SaleForm>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function handleOnSelectCopypoint(copypoint: CopypointResponse) {
    setCurrentCopypoint(copypoint)
  }

  const handleOnSelectCurrencyCode = (ISO: string) => {
    form.setValue('currency', ISO, { shouldDirty: true })
  }

  const handleOnSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
    form.setValue('paymentMethodId', paymentMethod.id, { shouldDirty: true })
  }

  const { NavigationGuardDialog, markAsSaved, hasUnsavedChanges } =
    useHookFormNavigationGuard(form)

  const onSubmit = async (data: SaleForm) => {
    try {
      await handleSubmit(data)
      // Marcar como guardado después del éxito
      markAsSaved(data)
    } catch (_) {
      toast.error('Error registering sale, please try again later.')
      // El formulario sigue bloqueado si hay error
    }
  }

  return (
    <Form {...form}>
      <form
        id='service-form'
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex-1 space-y-5 px-4'
      >
        <CopypointCombobox handleOnClick={handleOnSelectCopypoint} />

        <FormField
          control={form.control}
          name='currency'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <CurrencyCombobox
                  handleOnSelect={handleOnSelectCurrencyCode}
                  value={field.value}
                  label={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='paymentMethodId'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Payment method</FormLabel>
              <FormControl>
                <PaymentMethodsCombobox
                  handleOnSelect={handleOnSelectPaymentMethod}
                  value={field.value} // Pasar el valor actual del form
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {hasUnsavedChanges && (
          <div className='flex items-center gap-2 text-sm text-amber-600'>
            <span>⚠️</span>
            <span>Tienes cambios sin guardar</span>
          </div>
        )}
        <NavigationGuardDialog />

        <Button type='submit'>Register</Button>
      </form>
    </Form>
  )
}
