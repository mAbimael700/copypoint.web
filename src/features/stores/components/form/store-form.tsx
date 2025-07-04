"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CurrencyCombobox } from "@/features/currency/components/currency-combobox"
import { useHookFormNavigationGuard } from "@/hooks/use-navigation-guard"
import { FormProps } from "@/components/FormProps"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    currency: z.string().length(3)
})

type StoreForm = z.infer<typeof formSchema>

export function StoreForm({
    handleSubmit,
    defaultValues = { currency: "", name: "" } }: FormProps<StoreForm>) {
    // 1. Define your form.
    const form = useForm<StoreForm>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        handleSubmit(values)
        markAsSaved(values)
    }

    const handleOnSelectCurrencyCode = (ISO: string) => {
        form.setValue("currency", ISO, { shouldDirty: true })
    }

    const { NavigationGuardDialog, markAsSaved } = useHookFormNavigationGuard(form)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store name</FormLabel>
                            <FormControl>
                                <Input placeholder="copypoint" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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


                <Button type="submit">Submit</Button>

                <NavigationGuardDialog />
            </form>
        </Form>
    )
}