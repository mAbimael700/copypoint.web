import { useRef } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link2Icon, QrCodeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CheckoutDialog, {
  CheckoutDialogRef,
} from '@/features/checkout/components/checkout-dialog.tsx'
import {
  PaymentResponse,
  PaymentStatus,
} from '@/features/payments/types/Payment.type.ts'

interface Props {
  payment: PaymentResponse
}

const PaymentActions = ({ payment }: Props) => {
  const dialogRef = useRef<CheckoutDialogRef>(null)

  const handleOpen = () => {
    dialogRef.current?.open()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Details </DropdownMenuItem>

          {payment.paymentMethod === 'Digital Wallet' &&
            payment.status !== PaymentStatus.FAILED && (
              <>
                <DropdownMenuItem onClick={handleOpen}>
                  Share checkout <Link2Icon />{' '}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Share QR <QrCodeIcon />{' '}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

          {payment.status != PaymentStatus.FAILED && (
            <DropdownMenuItem>Cancel </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CheckoutDialog ref={dialogRef}  payment={payment} />
    </>
  )
}

export default PaymentActions
