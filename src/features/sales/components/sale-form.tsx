import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { FormProps } from "@/components/FormProps";
import { CurrencyCombobox } from "@/features/currency/components/currency-combobox";
import { PaymentMethodsCombobox } from "@/features/paymentmethod/components/payment-method-command";
import { PaymentMethod } from "@/features/paymentmethod/PaymentMethod.type";

const formSchema = z.object({
    currency: z.string().length(3, 'Name is required.'),
    paymentMethodId: z.number().positive(),
})

export type SaleForm = z.infer<typeof formSchema>

export const SaleForm = ({
    defaultValues = { currency: "", paymentMethodId: 0 },
    handleSubmit
}: FormProps<SaleForm>) => {

    const form = useForm<SaleForm>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    const handleOnSelectCurrencyCode = (ISO: string) => {
        form.setValue("currency", ISO)
    }
    const handleOnSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
        form.setValue("paymentMethodId", paymentMethod.id)
    }

    return (
        <Form {...form}>
            <form
                id='service-form'
                onSubmit={form.handleSubmit(handleSubmit)}
                className='flex-1 space-y-5 px-4'
            >

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
                                    label={field.value} />
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

            </form>
        </Form>
    )
}
