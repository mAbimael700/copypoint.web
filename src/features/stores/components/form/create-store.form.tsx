import FormLayout from "@/components/layout/form-layout";
import { StoreForm } from "./store-form"
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useCreateStore } from "../../hooks/useCreateStore";

export const CreateStoreForm = () => {
    // Opción 1: Usar search params para determinar el contexto
    // Definir el tipo de los search params
    const search = useSearch({
        from: "/_authenticated/stores/new/"
    }) as { context?: string; from?: string }

    const { mutate } = useCreateStore()
    const navigate = useNavigate()

    const [content, setContent] = useState<{
        description: string;
        header: string;
    }>({
        description: "Set up your store to start managing your business with CopyPoint",
        header: "Create Your Store"
    });

    useEffect(() => {
        // Determinar el contexto basado en los parámetros de búsqueda o la ruta
        const context = search?.context || search?.from;

        if (context === 'registration' || context === 'signup' || context === 'onboarding') {
            // Contenido para después del registro
            setContent({
                header: "Let's Create your First Store",
                description: "Welcome! Let's get you started by creating your first store in the application"
            });
        } else if (context === 'add-store' || context === 'new') {
            // Contenido para agregar una nueva tienda
            setContent({
                header: "Add New Store",
                description: "Create an additional store to expand your business operations"
            });
        } else {
            // Contenido por defecto (mejorado)
            setContent({
                header: "Create your Store",
                description: "Set up your store to start managing your business with CopyPoint"
            });
        }
    }, [search]);

    function onSubmit(values: { name: string; currency: string }): void | Promise<void> {
        mutate(values)
        navigate({ to: "/" })
    }

    return (
        <FormLayout description={content.description} header={content.header}>
            <StoreForm handleSubmit={onSubmit} />
        </FormLayout>
    )
}