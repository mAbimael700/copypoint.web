import { useNavigate } from '@tanstack/react-router';
import { Blocks, ChevronRight, Phone } from 'lucide-react'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator.tsx';
import { Header } from '@/components/layout/header.tsx';
import { Main } from '@/components/layout/main.tsx';
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts';


const CopypointManagement = () => {
  const { currentCopypoint } = useCopypointContext()
  const navigate = useNavigate()

  if (!currentCopypoint) {
    navigate({ to: '/copypoints' })
    return <></>
  }

  function handleIntegrationsBtnOnClick() {
    navigate({ to: '/copypoints/integrations' })
  }

  function handleServicePhoneBtnOnClick() {
    navigate({to:'/copypoints/phones'})
  }
  return (
    <>
      <Header className={''}></Header>

      <Main className={'space-y-4'}>
        <div>
          <h1 className={'text-3xl font-bold'}>Manage copypoint</h1>

          <p className={'text-muted-foreground'}>
            {' '}
            Manage copypoint{' '}
            {currentCopypoint.name.toLowerCase().replace('copypoint', '')}{' '}
            features and tools
          </p>
        </div>

        <Separator />

        <div className={
          'grid grid-cols-1 gap-4 lg:grid-cols-2'
        }>
          <Card
            className={'shadow-none hover:shadow'}
            onClick={handleIntegrationsBtnOnClick}
          >
            <CardHeader>
              <Blocks strokeWidth={1.5} />
              <CardTitle> Integrations</CardTitle>
              <CardDescription>
                See copypoint external service integrations
              </CardDescription>
              <CardAction>
                <ChevronRight />
              </CardAction>
            </CardHeader>
          </Card>

          <Card
            className={'shadow-none hover:shadow'}
            onClick={handleServicePhoneBtnOnClick}
          >
            <CardHeader>
              <Phone strokeWidth={1.5} />
              <CardTitle>Service phones </CardTitle>
              <CardDescription>
                See copypoint customer service phones
              </CardDescription>
              <CardAction>
                <ChevronRight />
              </CardAction>
            </CardHeader>
          </Card>
        </div>
      </Main>
    </>
  )
}

export default CopypointManagement
