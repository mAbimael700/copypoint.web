import { z } from "zod"
import { CopypointCreationDTO, CopypointEditDTO } from "../Copypoint.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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


const formSchema = z.object({
    name: z.string().min(2)
})

export type CopypointFormValues = z.infer<typeof formSchema>

interface CopypointFormProps {
    defaultValues: CopypointCreationDTO | CopypointEditDTO
    handleSubmit: (values: CopypointFormValues) => void
}

export function CopypointForm(props: CopypointFormProps) {

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: props.defaultValues,
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(props.handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Stationary name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the copypoint public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
