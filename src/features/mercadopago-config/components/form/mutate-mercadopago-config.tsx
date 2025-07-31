import FormLayout from '@/components/layout/form-layout.tsx'
import CreateMercadoPagoConfigForm
  from '@/features/mercadopago-config/components/form/create-mercado-pago-config-form.tsx'

const MutateMercadopagoConfig = () => {
  return (
    <FormLayout
    header='Mercado Pago Config'
    description='Register a mercado pago checkout configuration for the copypoint'>
      <CreateMercadoPagoConfigForm/>
    </FormLayout>
  )
}

export default MutateMercadopagoConfig