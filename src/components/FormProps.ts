export interface FormProps<T> {
    defaultValues?: T
    handleSubmit: (values: T) => void
}