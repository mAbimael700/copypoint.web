import { forwardRef, useImperativeHandle, useState } from 'react'
import { Copy, Loader2, ExternalLink, Check, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePaymentCheckoutQuery } from '@/features/payments/hooks/usePaymentCheckoutQuery'
import { PaymentResponse } from '@/features/payments/types/Payment.type.ts'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
    const [activeTab, setActiveTab] = useState('qrcode')
    const {
      data: checkoutData,
      isLoading,
      error,
    } = usePaymentCheckoutQuery({ paymentId: payment.id })

    const checkoutUrl = checkoutData?.checkoutUrl ?? ''

    // Formatear la fecha para mostrarla de manera más amigable
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Formatear el tipo de pago para mostrarlo con mejor estilo
    const getPaymentTypeStyle = (type: string) => {
      const typeMap: Record<string, { color: string, bg: string }> = {
        'CARD': { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30' },
        'TRANSFER': { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
        'CASH': { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
        'DEFAULT': { color: 'text-gray-700 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-950/30' }
      }

      const style = typeMap[type.toUpperCase()] || typeMap.DEFAULT
      return `${style.bg} ${style.color} px-2.5 py-1 rounded-full text-xs font-medium`
    }

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(checkoutUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        // Mostrar mensaje temporal
        const existingToast = document.getElementById('copy-toast');
        if (!existingToast) {
          const toast = document.createElement('div');
          toast.id = 'copy-toast';
          toast.className = 'fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5';
          toast.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Link copied to clipboard';
          document.body.appendChild(toast);

          setTimeout(() => {
            toast.className += ' animate-out fade-out slide-out-to-bottom-5';
            setTimeout(() => toast.remove(), 300);
          }, 1700);
        }
      } catch (error) {
        console.error('Failed to copy:', error);
      }
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

    // Función para abrir el enlace en una nueva pestaña
    const openExternalLink = () => {
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
                <QrCode className="h-4 w-4" />
              </span>
              Payment Checkout
            </DialogTitle>
            <DialogDescription>
              Share this payment information with your client
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-12 gap-4'>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
                <div className="relative bg-primary/20 p-4 rounded-full">
                  <Loader2 className='text-primary h-10 w-10 animate-spin' />
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium">Preparing Payment Information</p>
                <p className="text-muted-foreground text-sm mt-1">Please wait while we load the checkout details...</p>
              </div>
            </div>
          ) : error ? (
            <div className='flex flex-col items-center py-10 gap-3'>
              <div className="bg-destructive/10 text-destructive flex h-12 w-12 items-center justify-center rounded-full">
                <span className="text-xl font-bold">!</span>
              </div>
              <p className='text-destructive font-medium'>Failed to load checkout information</p>
              <p className="text-muted-foreground text-sm">Please try again or contact support if the issue persists.</p>
            </div>
          ) : checkoutData ? (
                          <Tabs defaultValue="qrcode" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="qrcode" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qrcode" className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative mt-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-5 rounded-xl shadow-md border border-blue-100 dark:border-blue-900/50 flex items-center justify-center transition-all hover:shadow-lg">
                          {checkoutUrl && (
                            <div className="bg-white dark:bg-background p-3 rounded-lg shadow-inner">
                              <QRCodeSVG 
                                value={checkoutUrl} 
                                size={220} 
                                className="rounded" 
                                bgColor={"transparent"}
                                level={"H"}
                                includeMargin={true}
                              />
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                          QR Code
                        </div>
                        <div className="absolute -bottom-2 right-3 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full shadow-sm border border-green-200 dark:border-green-800/50">
                          Ready to scan
                        </div>
                      </div>

                      <div className="w-full">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 relative group">
                            <div className="relative flex-1 overflow-hidden rounded-md">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                              </div>
                              <Input 
                                value={checkoutUrl} 
                                readOnly 
                                className="pl-8 pr-20 font-mono text-xs bg-muted/50 truncate transition-all hover:bg-muted/80 focus:bg-muted/80"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                                <div className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                  URL
                                </div>
                              </div>
                            </div>
                            <Button 
                              size='icon' 
                              variant={copied ? "default" : "secondary"}
                              onClick={handleCopy}
                              className={`h-9 w-9 rounded-md transition-all ${copied ? "bg-green-600 text-white hover:bg-green-700" : ""}`}
                              title="Copy link"
                            >
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button 
                              size='icon' 
                              variant="secondary"
                              onClick={openExternalLink}
                              className="h-9 w-9 rounded-md transition-all hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400"
                              title="Open in new tab"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <Check className="h-3.5 w-3.5 text-green-500" />
                            <span>Share this link with your client to complete the payment</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/40 rounded-lg p-3 space-y-1 col-span-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Payment ID</p>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-xs">
                            Active
                          </span>
                        </div>
                        <p className="font-mono text-sm">{payment.id}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Gateway ID</p>
                        <p className="font-medium font-mono text-sm">{checkoutData.gatewayId}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <span className={getPaymentTypeStyle(checkoutData.type)}>
                          {checkoutData.type.toLowerCase()}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-medium text-green-600 dark:text-green-400">
                          ${payment.amount.toFixed(2)}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Created At</p>
                        <p className="font-medium text-xs">
                          {formatDate(checkoutData.dateCreated)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-xs text-muted-foreground mb-1">Payment URL</div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input 
                            value={checkoutUrl} 
                            readOnly 
                            className="pr-10 font-mono text-xs bg-muted/50"
                          />
                        </div>
                        <Button 
                          size='icon' 
                          variant="ghost"
                          onClick={handleCopy}
                          className="h-9 w-9 rounded-md transition-all"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : null}

          {checkoutData && (
            <DialogFooter className="mt-4 gap-2">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1 sm:flex-none"
              >
                Close
              </Button>
              <Button 
                onClick={openExternalLink} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-1 sm:flex-none"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Payment Page
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    )
  }
)

export default CheckoutDialog
