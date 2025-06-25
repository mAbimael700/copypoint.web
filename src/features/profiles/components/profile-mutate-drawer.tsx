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
import { ProfileForm } from './profile-form'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    profile: ProfileForm
    onSubmit: (values: ProfileForm) => void
}


export const ProfileMutateDrawer = ({ open, onOpenChange, profile, onSubmit }: Props) => {
    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v)
            }}
        >
            <SheetContent className='flex flex-col'>
                <SheetHeader className='text-left'>
                    <SheetTitle> Profile</SheetTitle>
                    <SheetDescription>
                        Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <ProfileForm defaultValues={profile} handleSubmit={onSubmit} />
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
