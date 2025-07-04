import { ProfileDropdown } from "../profile-dropdown";
import { ThemeSwitch } from "../theme-switch";
import { Separator } from "../ui/separator";
import { Header } from "./header";
import { Main } from "./main";
import { Search } from "../search";
import { cn } from "@/lib/utils";


interface FormLayoutProps {
    children?: React.ReactNode
    header: string
    description: string
    aside?: React.ReactNode
    className?: string
}

export default function FormLayout({ children, header, description, aside, className }: FormLayoutProps) {

    return (
        < >
            {/* ===== Top Heading ===== */}
            <Header>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main fixed>
                <div className='space-y-0.5'>
                    <h1 className='text-xl font-bold tracking-tight md:text-2xl'>
                        {header}
                    </h1>
                    <p className='text-muted-foreground'>
                        {description}
                    </p>
                </div>
                <Separator className='my-4 lg:my-6' />
                <div className='flex flex-1 flex-col space-y-2 overflow-y-auto md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
                    {aside && <aside className='top-0 lg:sticky lg:w-1/5'>

                    </aside>}
                    <div className={cn('flex w-full overflow-y-auto p-1', className)}>
                        {children}
                    </div>
                </div>
            </Main>
        </>
    )
}