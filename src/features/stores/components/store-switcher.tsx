import { ChevronsUpDown, Plus, Store } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useStores } from '../hooks/useStores'
import { useStoreContext } from '../storage/useStoreContext'
import { useEffect } from 'react'

export function StoreSwitcher() {
  const { isMobile } = useSidebar()

  const { getAll } = useStores()
  const { data, isSuccess } = getAll()
  const { activeStore, setActiveStore } = useStoreContext()

  // Solo ejecutar cuando los datos cambien y no haya store activo
  useEffect(() => {
    if (isSuccess && data && !activeStore) {
      const firstStore = data.content.at(0)
      if (firstStore) {
        setActiveStore(firstStore)
      }
    }
  }, [isSuccess, data, activeStore, setActiveStore])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                {/*  <activeTeam.logo className='size-4' /> */}

                <Store className='h-4 w-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {activeStore?.name}
                </span>
                <span className='truncate text-xs'>{activeStore?.createdAt}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Stores
            </DropdownMenuLabel>
            {data?.content.map((store, index) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => setActiveStore(store)}
                className='gap-2 p-2'
              >
                {/* <div className='flex size-6 items-center justify-center rounded-sm border'>
                  <team.logo className='size-4 shrink-0' />
                </div> */}
                {store.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                <Plus className='size-4' />
              </div>
              <div className='text-muted-foreground font-medium'>Add store</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
