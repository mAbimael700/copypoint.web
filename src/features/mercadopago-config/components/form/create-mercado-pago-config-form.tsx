import FormLayout from '@/components/layout/form-layout.tsx'
import MercadoPagoConfigForm, {
  MercadoPagoConfigFormValues,
} from '@/features/mercadopago-config/components/form/mercado-pago-config-form-values.tsx'

const CreateMercadoPagoConfigForm = () => {
  const onSubmit = (values: MercadoPagoConfigFormValues) => {
    console.log(values)
  }

  return (
    <FormLayout
      header='Mercado Pago Config'
      description='Register a new store copypoint '
    >
      <MercadoPagoConfigForm handleSubmit={onSubmit} />
    </FormLayout>
  )
}

export default CreateMercadoPagoConfigForm
