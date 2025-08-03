import FormLayout from '@/components/layout/form-layout.tsx'
import MercadoPagoConfigForm, {
  MercadoPagoConfigFormValues,
} from '@/features/mercadopago-config/components/form/mercado-pago-config-form.tsx'
import { useCreateMercadoPagoConfig } from '@/features/mercadopago-config/hooks/useMercadoPagoConfig'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { MercadoPagoConfigCreationRequest } from '@/features/mercadopago-config/types/MercadoPagoConfig.type'

const CreateMercadoPagoConfigForm = () => {
  const createMutation = useCreateMercadoPagoConfig()
  const router = useRouter()

  const onSubmit = async (values: MercadoPagoConfigFormValues) => {
    try {
      // Convertir el formulario a la estructura esperada por la API
      const requestData: MercadoPagoConfigCreationRequest = {
        accessToken: values.accessToken,
        publicKey: values.publicKey,
        clientId: values.clientId,
        clientSecret: values.clientSecret,
        isSandbox: values.isSandbox, // Nota: hay una discrepancia en el nombre (isSandox vs isSandbox)
        webhookSecret: values.webhookSecret,
        vendorEmail: values.vendorEmail
      }

      // Utilizar el mutation para crear la configuración
      await createMutation.mutateAsync({
        data: requestData
      })

      toast.success('MercadoPago configuration created successfully')

      // Redirigir a la lista de configuraciones o a donde sea apropiado
      router.navigate({ to: '/copypoints/integrations' })
    } catch (error) {
      toast.error('Failed to create MercadoPago configuration')
      throw error // Re-lanzar el error para que el formulario pueda manejarlo
    }
  }

  return (
    <FormLayout
      header='Mercado Pago Configuration'
      description='Register a new copypoint mercado pago configuration'
    >
      <MercadoPagoConfigForm 
        handleSubmit={onSubmit} 
        isSubmitting={createMutation.isPending}
      />
    </FormLayout>
  )
}

export default CreateMercadoPagoConfigForm
