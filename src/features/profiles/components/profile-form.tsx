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


const formSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
})

export type ProfileForm = z.infer<typeof formSchema>

export const ProfileForm = ({ defaultValues, handleSubmit }: FormProps<ProfileForm>) => {

    const form = useForm<ProfileForm>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })
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
                                <Input {...field} placeholder='Enter a title' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
