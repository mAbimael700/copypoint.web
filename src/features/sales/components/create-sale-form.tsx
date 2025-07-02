import FormLayout from "@/components/layout/form-layout"
import { SaleForm } from "./sale-form"
import { SaleProfileForm, SaleProfilesFormValues } from "@/features/saleprofile/components/sale-profile-form";

export const CreateSaleForm = () => {
    function onHandleSubmit(values: SaleForm): void {
        console.log(values);

        throw new Error("Function not implemented.")
    }

    function onHandleSaleProfileSubmit(values: SaleProfilesFormValues): void {
        console.log(values)
        throw new Error("Function not implemented.");
    }
    // Usar el hook especializado para formularios





    return (
        <FormLayout
            description="Create a new copypoint sale"
            header="Register sale"
            className="gap-5"
        >

            <div>
                <SaleForm defaultValues={{ currency: "", paymentMethodId: 0 }}
                    handleSubmit={onHandleSubmit} />
            </div>

            <div>
                <SaleProfileForm handleSubmit={onHandleSaleProfileSubmit} />
            </div>
        </FormLayout>
    )
}
