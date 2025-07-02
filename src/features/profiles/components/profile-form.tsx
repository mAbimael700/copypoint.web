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
import { Input } from '@/components/ui/input'
import { FormProps } from "@/components/FormProps";
import { useServiceByStoreOperations } from "@/features/services/hooks/useService";
import { useStoreContext } from "@/features/stores/storage/useStoreContext";
import { Button } from "@/components/ui/button";
import { ServiceCommand } from "@/features/services/components/service-command";
import type { Service } from "@/features/services/Service.type";
import { Separator } from "@radix-ui/react-separator";



const formSchema = z.object({
    name: z.string().min(2, 'Name is required.'),
    description: z.string().min(2),
    unitPrice: z.number().positive(),
    services: z.array(z.number()).min(1)
})

export type ProfileForm = z.infer<typeof formSchema>

export const ProfileForm = ({
    defaultValues = { name: "", description: "", services: [], unitPrice: 1 },
    handleSubmit
}: FormProps<ProfileForm>) => {
    const { activeStore } = useStoreContext()
    const { services } = useServiceByStoreOperations(activeStore?.id || 0)

    const form = useForm<ProfileForm>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    function handleSelectService(service: Service) {
        const services = form.getValues('services')

        const findService = services.find(id => id === service.id)

        if (findService) {
            const filteredServices = services.filter(id => id !== service.id)
            return form.setValue('services', filteredServices)
        }

        services.push(service.id)
        form.setValue('services', services)
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
                    name='name'
                    render={({ field }) => (
                        <FormItem className='space-y-1'>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='Enter a name' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem className='space-y-1'>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='Enter a description' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="unitPrice"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel>Unit price</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}

                                    onChange={(e) => {
                                        // Convertir a número o mantener undefined si está vacío
                                        const value = e.target.value === "" ? undefined : Number(e.target.value);
                                        field.onChange(value); // Esto actualiza el formulario
                                    }}
                                    value={field.value ?? ""} // Mostrar vacío si es undefined/null
                                    placeholder="Enter a price"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='services'
                    render={({ field }) => (
                        <FormItem className='space-y-1'>
                            <FormLabel>Services</FormLabel>
                            <FormControl>

                                <div className="grid gap-2 w-full">
                                    <ServiceCommand handleOnClick={handleSelectService} />
                                    <Separator />
                                    <div className="space-y-2">
                                        {
                                            field.value.length > 0
                                                ?
                                                field.value.map(id => {
                                                    if (services) {
                                                        const findService = services.find(s => s.id == id);
                                                        if (findService)


                                                            return (
                                                                <div key={id} className="flex gap-2">
                                                                    <Button
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            handleSelectService(findService)
                                                                        }}
                                                                        variant={"outline"}
                                                                        className="h-8 w-max"
                                                                    >
                                                                        {findService?.name}
                                                                    </Button>
                                                                </div>
                                                            )
                                                    }
                                                    return null;
                                                })
                                                :
                                                <div className="text-sm text-muted-foreground">No services selected yet</div>
                                        }
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


            </form>
        </Form>
    )
}
