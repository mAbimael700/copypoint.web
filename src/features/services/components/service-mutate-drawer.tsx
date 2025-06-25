import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { ServiceForm } from './service-form'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    service: ServiceForm
    onSubmit: (values: ServiceForm) => void
}


export const ServiceMutateDrawer = ({ open, onOpenChange, service, onSubmit }: Props) => {
    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v)
            }}
        >
            <SheetContent className='flex flex-col'>
                <SheetHeader className='text-left'>
                    <SheetTitle> Service</SheetTitle>
                    <SheetDescription>
                        Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <ServiceForm defaultValues={service} handleSubmit={onSubmit} />
                <SheetFooter className='gap-2'>
                    <SheetClose asChild>
                        <Button variant='outline'>Close</Button>
                    </SheetClose>
                    <Button form='service-form' type='submit'>
                        Save changes
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
