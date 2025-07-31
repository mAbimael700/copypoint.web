import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useHookFormNavigationGuard } from '@/hooks/use-navigation-guard.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { FormProps } from '@/components/FormProps.ts'
import { PasswordInput } from '@/components/password-input.tsx'

const formSchema = z.object({
  accessToken: z
    .string({ message: 'access token is required.' })
    .min(1, { message: 'access token is required.' }),
  publicKey: z
    .string({ message: 'public key is required.' })
    .min(1, { message: 'public key is required.' }),
  clientId: z
    .string({ message: 'client id is required.' })
    .min(1, { message: 'client id is required.' }),
  clientSecret: z
    .string({ message: 'client secret is required.' })
    .min(1, { message: 'client secret is required.' }),
  webhookSecret: z
    .string({ message: 'webhook secret is required.' })
    .min(1, { message: 'webhook secret is required.' }),
  isSandbox: z.boolean(),
  vendorEmail: z
    .string({ message: 'vendor email is required.' })
    .min(1, { message: 'vendor email is required.' })
    .email({ message: 'vendor email is invalid.' }),
})

export type MercadoPagoConfigFormValues = z.infer<typeof formSchema>

const MercadoPagoConfigForm = ({
  defaultValues = {
    accessToken: '',
    publicKey: '',
    clientId: '',
    clientSecret: '',
    webhookSecret: '',
    isSandbox: false,
    vendorEmail: '',
  },
  handleSubmit,
}: FormProps<MercadoPagoConfigFormValues>) => {
  const form = useForm<MercadoPagoConfigFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { NavigationGuardDialog, markAsSaved, hasUnsavedChanges } =
    useHookFormNavigationGuard(form)

  const onSubmit = async (data: MercadoPagoConfigFormValues) => {
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

        <FormField
          control={form.control}
          name='vendorEmail'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Vendor email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name='publicKey'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Public Key</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='accessToken'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Access token</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='clientId'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Client Id</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='clientSecret'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Client secret</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='isSandbox'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Is sandbox</FormLabel>
              <FormControl>
                <Checkbox checked={field.value} onChange={field.onChange} />
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

export default MercadoPagoConfigForm
