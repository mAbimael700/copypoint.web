import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main.tsx';
import { Header } from '@/components/layout/header.tsx'


const CustomerServicePhone = () => {
  return (

    <>
      <Header></Header>
      <Main className={'space-y-4'}>
        <div>
          <h1 className={'text-3xl font-bold'}>Customer Service Phones</h1>
          <p className={'text-muted-foreground'}>
            Administrate copypoint customer service phone numbers here!
          </p>
        </div>

        <Separator />

        <Link
          className={buttonVariants()}
          to={'/copypoints/phones/create'}
        >
          <PlusCircledIcon /> Create new phone
        </Link>
        <div></div>
      </Main>
    </>
  )
}

export default CustomerServicePhone
