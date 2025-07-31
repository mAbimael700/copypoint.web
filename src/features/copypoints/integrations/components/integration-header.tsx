import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Search, Settings, Plus } from "lucide-react"
import { Header } from '@/components/layout/header.tsx'
import { Link } from '@tanstack/react-router'

export const IntegrationsHeader = () => {
  return (
    <Header className="">
      <div className={'flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full'}>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Manage and configure external services for your copypoint</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search integrations..." className="pl-10 w-[250px]" />
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Link to={'/copypoints/integrations/add'} className={buttonVariants()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Link>
        </div>
      </div>
    </Header>
  )
}
