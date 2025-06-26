import FormLayout from "@/components/layout/form-layout"
import { SaleForm } from "./sale-form"

export const CreateSaleForm = () => {
    function onHandleSubmit(values: SaleForm): void {
        console.log(values);

        throw new Error("Function not implemented.")
    }

    return (
        <FormLayout
            description="Create a new copypoint sale"
            header="Register sale">

            <div>
                <SaleForm defaultValues={{ currency: "", paymentMethodId: 0 }}
                    handleSubmit={onHandleSubmit} />
            </div>
        </FormLayout>
    )
}
