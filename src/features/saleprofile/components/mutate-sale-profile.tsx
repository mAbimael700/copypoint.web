import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import FormLayout from '@/components/layout/form-layout.tsx';
import { SaleProfileForm, SaleProfilesFormValues } from '@/features/saleprofile/components/form/sale-profile-form.tsx';
import { useSaleContext } from '@/features/sales/hooks/useSaleContext.ts';


const MutateSaleProfile = () => {
  const { currentSale } = useSaleContext()
  const navigate = useNavigate()

  function onHandleSaleProfileSubmit(_: SaleProfilesFormValues): void {
    throw new Error('Function not implemented.')
  }

  async function handleBack() {
    if (!currentSale) {
      await navigate({ to: '/sales' })
    }
  }

  React.useEffect(() => {
    handleBack()
  }, [currentSale])

  return (
    <FormLayout header={'Add profiles to sale #' + currentSale?.id} description={'Add profiles to sale'} className={"w-full"}>
      <SaleProfileForm handleSubmit={onHandleSaleProfileSubmit} />
    </FormLayout>
  )
}

export default MutateSaleProfile
