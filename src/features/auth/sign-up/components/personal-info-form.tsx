import { z } from "zod";
import { useMultiStepForm } from "../context/sign-up-context";
import { useSignUp } from "../../hooks/useSignUp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const personalInfoSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    phoneNumber: z.string(),
});

export function PersonalInfoStep() {
    const {
        personalInfo,
        updatePersonalInfo,
        prevStep,
        canGoPrev,
        authData,
        resetForm
    } = useMultiStepForm();

    const signupMutation = useSignUp();
    const { isPending } = signupMutation;

    const form = useForm<z.infer<typeof personalInfoSchema>>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: personalInfo,
    });

    const onSubmit = (data: z.infer<typeof personalInfoSchema>) => {
        updatePersonalInfo(data);

        // Crear el objeto completo para el signup
        const signupData = {
            email: authData.email,
            password: authData.password,
            personalInfo: data,
        };

        signupMutation.mutate(signupData, {
            onSuccess: () => {
                resetForm();
                // Aquí puedes redirigir o mostrar un mensaje de éxito
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                updatePersonalInfo({ firstName: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Doe"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                updatePersonalInfo({ lastName: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="+1 (555) 123-4567"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            updatePersonalInfo({ phoneNumber: e.target.value });
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={!canGoPrev() || isPending}
                            className="flex-1"
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1"
                        >
                            {isPending ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}