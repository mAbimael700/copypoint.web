import { forwardRef, useImperativeHandle, useState } from 'react'
import { Copy, CopyCheck, Loader2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePaymentCheckoutQuery } from '@/features/payments/hooks/usePaymentCheckoutQuery'
import { PaymentResponse } from '@/features/payments/types/Payment.type.ts'

export interface CheckoutDialogRef {
  open: () => void
  close: () => void
  isOpen: () => boolean
}

interface Props {
  payment: PaymentResponse
}

const CheckoutDialog = forwardRef<CheckoutDialogRef, Props>(
  ({ payment }, ref) => {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const {
      data: checkoutData,
      isLoading,
      error,
    } = usePaymentCheckoutQuery({ paymentId: payment.id })

    const checkoutUrl = checkoutData?.checkoutUrl ?? ''

    const handleCopy = async () => {
      await navigator.clipboard.writeText(checkoutUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
        isOpen: () => open,
      }),
      [open]
    )

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment checkout information</DialogTitle>
            <DialogDescription>
              Share payment checkout information
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='text-primary h-8 w-8 animate-spin' />
              <span className='ml-2'>Loading checkout information...</span>
            </div>
          ) : error ? (
            <div className='text-destructive py-4 text-center'>
              Failed to load checkout information. Please try again.
            </div>
          ) : checkoutData ? (
            <div className={'space-y-4'}>
              <div>
                <div className={'flex gap-2'}>
                  <Input value={checkoutUrl} readOnly />
                  <Button size='icon' onClick={handleCopy}>
                    {copied ? <CopyCheck /> : <Copy />}
                  </Button>
                </div>
                <div className={'text-muted-foreground text-sm'}>
                  Share checkout url payment to client
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <div>
                  <span className='font-medium'>Gateway ID:</span>{' '}
                  {checkoutData.gatewayId}
                </div>
                <div>
                  <span className='font-medium'>Type:</span> {checkoutData.type}
                </div>
                <div>
                  <span className='font-medium'>Created:</span>{' '}
                  {new Date(checkoutData.dateCreated).toLocaleString()}
                </div>
              </div>

              <div
                className={
                  'bg-accent flex aspect-square w-[250px] items-center justify-center rounded border'
                }
              >
                {checkoutUrl && <QRCodeSVG value={checkoutUrl} size={200} />}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    )
  }
)

export default CheckoutDialog
