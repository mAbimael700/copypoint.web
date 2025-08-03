import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useHookFormNavigationGuard } from '@/hooks/use-navigation-guard.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Switch } from '@/components/ui/switch.tsx'
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
  isSubmitting = false,
}: FormProps<MercadoPagoConfigFormValues> & { isSubmitting?: boolean }) => {
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
        className='w-full space-y-6'
        aria-labelledby='mercado-pago-config-title'
      >
        <fieldset className='space-y-4'>
          <div className={'space-y-4 rounded-md shadow-none'}>
            <div>
              <legend className='text-lg font-medium'>
                Account Information
              </legend>
              <p className={'text-muted-foreground text-sm'}>
                Enter your Mercado Pago account information below.
              </p>
            </div>

              <FormField
                control={form.control}
                name='vendorEmail'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='vendorEmail'>Vendor email</FormLabel>
                    <FormControl>
                      <Input
                        id='vendorEmail'
                        placeholder={'uservendor@email.com'}
                        {...field}
                        aria-describedby='vendorEmail-description'
                      />
                    </FormControl>
                    <FormDescription id='vendorEmail-description'>
                      This is the email registered in your Mercado Pago app
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='publicKey'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='publicKey'>Public Key</FormLabel>
                    <FormControl>
                      <Input
                        id='publicKey'
                        placeholder={'APP_USR-abcdefg...'}
                        {...field}
                        aria-describedby='publicKey-description'
                      />
                    </FormControl>
                    <FormDescription id='publicKey-description'>
                      This is the public key of your Mercado Pago app
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        </fieldset>

        <Separator />
        <fieldset className='space-y-4'>
          <div className={'space-y-4'}>
            <div>
              <legend className='text-lg font-medium'>API Credentials</legend>
              <p className={'text-muted-foreground text-sm'}>
                Enter your Mercado Pago credentials
              </p>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='accessToken'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='accessToken'>Access token</FormLabel>
                    <FormControl>
                      <PasswordInput
                        id='accessToken'
                        placeholder='********'
                        {...field}
                        aria-describedby='accessToken-description'
                      />
                    </FormControl>
                    <FormDescription id='accessToken-description'>
                      This is the secret key of your Mercado Pago app
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='clientId'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='clientId'>Client ID</FormLabel>
                    <FormControl>
                      <Input
                        id='clientId'
                        placeholder={'123456789'}
                        {...field}
                        aria-describedby='clientId-description'
                      />
                    </FormControl>
                    <FormDescription id='clientId-description'>
                      This is the client ID of your Mercado Pago app
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='clientSecret'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='clientSecret'>Client secret</FormLabel>
                    <FormControl>
                      <PasswordInput
                        id='clientSecret'
                        placeholder='********'
                        {...field}
                        aria-describedby='clientSecret-description'
                      />
                    </FormControl>
                    <FormDescription id='clientSecret-description'>
                      This is the client secret of your Mercado Pago app
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='webhookSecret'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='webhookSecret'>
                      Webhook Secret
                    </FormLabel>
                    <FormControl>
                      <div className={'grid grid-cols-4 gap-2'}>
                        <div className={'col-span-3'}>
                          <PasswordInput
                            id='webhookSecret'
                            className={'w'}
                            placeholder='********'
                            {...field}
                            aria-describedby='webhookSecret-description'
                          />
                        </div>
                        <Button 
                          type='button' 
                          onClick={() => {
                            // Generar un secreto seguro aleatorio
                            const randomSecret = Math.random().toString(36).substring(2, 15) + 
                                             Math.random().toString(36).substring(2, 15);
                            form.setValue('webhookSecret', randomSecret, { shouldDirty: true });
                          }}
                        >
                          Generate
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription id='webhookSecret-description'>
                      This is the webhook secret for your Mercado Pago app
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </fieldset>
        <Separator/>

        <fieldset className='space-y-4'>
          <legend className='text-lg font-medium'>Settings</legend>
          <FormField
            control={form.control}
            name='isSandbox'
            render={({ field }) => (
              <FormItem className='space-y-2'>
                <div className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel htmlFor='isSandbox' className='text-base'>
                      Sandbox Mode
                    </FormLabel>
                    <FormDescription id='isSandbox-description'>
                      Enable if this configuration is for testing in Mercado
                      Pago sandbox environment
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      id='isSandbox'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby='isSandbox-description'
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {hasUnsavedChanges && (
          <div
            className='flex items-center gap-2 text-sm text-amber-600'
            role='alert'
            aria-live='polite'
          >
            <span aria-hidden='true'>⚠️</span>
            <span>There are unsaved changes</span>
          </div>
        )}
        <NavigationGuardDialog />

        <div className='flex justify-end pt-4'>
          <Button type='submit' className='min-w-32' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default MercadoPagoConfigForm
