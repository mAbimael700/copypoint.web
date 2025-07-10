import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import {
  CreditCard,
  FileText,
  Hash,
  Loader2,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/authStore'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CurrencyCombobox } from '@/features/currency/components/currency-combobox'
import {
  FormSchema,
  formSchema,
} from '@/features/mercadopago-payment/components/form/form-schema'
import { usePaymentActions } from '@/features/mercadopago-payment/hooks/useMercadoPagoPaymentActions'
import { PaymentRequest } from '@/features/mercadopago-payment/types/MercadoPagoPaymentResponse.type'
import { useStoreContext } from '@/features/stores/context/useStoreContext'

interface MercadoPagoPaymentFormProps {
  onPaymentSuccess?: (paymentId: string, checkoutUrl: string) => void
  onPaymentError?: (error: Error) => void
  autoRedirect?: boolean
}

const MercadoPagoPaymentForm: React.FC<MercadoPagoPaymentFormProps> = ({
  onPaymentSuccess,
  onPaymentError,
  autoRedirect = true,
}) => {
  const { activeStore } = useStoreContext()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createPayment, paymentState, currentSale, resetPaymentState } =
    usePaymentActions({
      onPaymentSuccess: (paymentId, checkoutUrl) => {
        toast.success('¡Pago creado exitosamente!')
        onPaymentSuccess?.(paymentId, checkoutUrl)
      },
      onPaymentError: (error) => {
        toast.error(`Error al crear el pago: ${error.message}`)
        onPaymentError?.(error)
      },
      autoRedirect,
    })

  // 1. Define your form.
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 1,
      payerSchema: {
        email: user?.email || '',
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName:
          user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        identficationType: 'DNI',
        identification: '',
        phone: '',
      },
      saleId: currentSale?.id || 0,
      description: currentSale ? `Pago para venta #${currentSale.id}` : '',
    },
  })

  // 2. Update form when user or sale changes
  React.useEffect(() => {
    if (user) {
      form.setValue('payerSchema.email', user.email)
      form.setValue(
        'payerSchema.firstName',
        user.firstName || user.name?.split(' ')[0] || ''
      )
      form.setValue(
        'payerSchema.lastName',
        user.lastName || user.name?.split(' ').slice(1).join(' ') || ''
      )
    }
  }, [user, form])

  React.useEffect(() => {
    if (currentSale) {
      form.setValue('saleId', currentSale.id)
      form.setValue('description', `Payment for sale #${currentSale.id}`)
    }
    if (activeStore) {
      form.setValue('currency', activeStore.currency)
    }
  }, [currentSale, form, activeStore])

  // 3. Reset form errors when payment state resets
  React.useEffect(() => {
    if (paymentState.isSuccess) {
      form.reset()
    }
  }, [paymentState.isSuccess, form])

  async function onSubmit(values: FormSchema) {
    try {
      resetPaymentState() // Reset any previous errors

      const paymentRequest = {
        saleId: values.saleId,
        description: values.description,
        payer: {
          firstName: values.payerSchema.firstName,
          lastName: values.payerSchema.lastName,
          email: values.payerSchema.email,
          phone: values.payerSchema.phone,
          identification: values.payerSchema.identification,
          identificationType: values.payerSchema.identficationType,
        },
        currency: values.currency,
        amount: values.amount,
      } satisfies PaymentRequest

      await createPayment(paymentRequest.payer, paymentRequest.description)
    } catch (error) {
      toast.error('Error en el formulario: ' + error)
      // El error ya se maneja en el hook usePaymentActions
    }
  }

  if (!currentSale) {
    navigate({ to: '/sales' })
    return null
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Personal Information Section */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-medium'>
              <User className='h-4 w-4' />
              Personal information
            </h3>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='payerSchema.firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        {...field}
                        disabled={paymentState.isCreating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='payerSchema.lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Doe'
                        {...field}
                        disabled={paymentState.isCreating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='payerSchema.email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='tu@email.com'
                      {...field}
                      disabled={paymentState.isCreating}
                    />
                  </FormControl>
                  <FormDescription>
                    Payment confirmation will be sent to this email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='payerSchema.phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <Phone className='h-4 w-4' />
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='tel'
                      placeholder='+52 999 123 4567'
                      {...field}
                      disabled={paymentState.isCreating}
                    />
                  </FormControl>
                  <FormDescription>
                    Contact number for notifications
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Identification Section */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-medium'>
              <Hash className='h-4 w-4' />
              Identification
            </h3>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <FormField
                control={form.control}
                name='payerSchema.identficationType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identification type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={paymentState.isCreating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='DNI'>DNI</SelectItem>
                        <SelectItem value='PASSPORT'>Passport</SelectItem>
                        <SelectItem value='CEDULA'>Cédula</SelectItem>
                        <SelectItem value='CURP'>CURP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='payerSchema.identification'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Identification Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Type identification number'
                        {...field}
                        disabled={paymentState.isCreating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Payment amount'
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value
                      if (!Number.isNaN(Number(value))) {
                        form.setValue('amount', Number(value))
                      }
                    }}
                    disabled={paymentState.isCreating}
                  />
                </FormControl>
                <FormDescription>Amount</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='currency'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <CurrencyCombobox
                    label={field.value}
                    value={field.value}
                    handleOnSelect={(ISO) => {
                      form.setValue('currency', ISO)
                    }}
                  />
                </FormControl>
                <FormDescription>Currency</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Details Section */}
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-medium'>
              <FileText className='h-4 w-4' />
              Payment Details
            </h3>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Payment Description'
                      {...field}
                      disabled={paymentState.isCreating}
                    />
                  </FormControl>
                  <FormDescription>
                    Description of the payment that will be shown on the ticket
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div>Sale ID</div>
              <div>#{currentSale.id}</div>
            </div>
          </div>

          {/* Error Display */}
          {paymentState.isError && paymentState.error && (
            <Alert variant='destructive'>
              <AlertDescription>{paymentState.error.message}</AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {paymentState.isSuccess && paymentState.data && (
            <Alert className='border-green-500 bg-green-50'>
              <AlertDescription className='text-green-700'>
                ¡Pago creado exitosamente!
                {!autoRedirect && (
                  <span>
                    {' '}
                    <a
                      href={paymentState.data.checkoutUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='font-medium underline'
                    >
                      Haz clic aquí para completar el pago
                    </a>
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className='flex gap-3'>
            <Button
              type='submit'
              disabled={
                paymentState.isCreating || !paymentState.canCreatePayment
              }
              className='flex-1'
            >
              {paymentState.isCreating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className='mr-2 h-4 w-4' />
                  Add payment
                </>
              )}
            </Button>

            {paymentState.isError && (
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  resetPaymentState()
                  form.clearErrors()
                }}
              >
                Reintentar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  )
}

export default MercadoPagoPaymentForm
