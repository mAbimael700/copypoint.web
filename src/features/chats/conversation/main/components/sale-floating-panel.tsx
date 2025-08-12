import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus,
  ShoppingCart,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAttachmentStore } from '@/features/chats/stores/attachment-store'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext'
import { useSalesOperations } from '@/features/sales/hooks/useSales'
import { cn } from '@/lib/utils'

const SaleFloatingPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { currentSale, setCurrentSale } = useSaleContext()
  const { currentCopypoint } = useCopypointContext()

  // Obtener ventas disponibles
  const { sales, isLoading, createSale } = useSalesOperations()

  // Obtener attachments marcados para venta
  const attachmentsForSale = useAttachmentStore(
    (state) => state.attachmentsForSale
  )

  // Crear una nueva venta
  const handleCreateSale = async () => {
    if (!currentCopypoint) {
      toast.error('Debe seleccionar un punto de copia primero')
      return
    }

    try {
      const newSale = await createSale({
        currency: 'USD',
        paymentMethodId: 1 // Valor por defecto, debería configurarse según la aplicación
      })

      setCurrentSale(newSale)
      toast.success('Venta creada exitosamente')
    } catch (error) {
      toast.error(`Error al crear la venta: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Seleccionar la primera venta al cargar si no hay una seleccionada
  useEffect(() => {
    if (!currentSale && sales && sales.length > 0 && !isLoading) {
      setCurrentSale(sales[0])
    }
  }, [sales, currentSale, setCurrentSale, isLoading])

  // Cambiar la venta seleccionada
  const handleSaleChange = (saleId: string) => {
    const selectedSale = sales.find((sale) => sale.id.toString() === saleId)
    if (selectedSale) {
      setCurrentSale(selectedSale)
    }
  }

  return (
    <div
      className={`fixed right-6 bottom-20 z-20 transition-all duration-300 ease-in-out
       ${isExpanded ? 'w-80' : 'w-auto'}`}
    >
      <Card className={cn('border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300', 
        isExpanded ? '' : 'bg-transparent border-none shadow-none hover:shadow-none')}>
        {/* Header con botón circular */}
        <CardHeader 
          className='pb-3 cursor-pointer'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3 mr-2'>
              <div className="relative">
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center ">
                  <ShoppingCart className='text-primary h-5 w-5' />
                </div>
                {!isExpanded && attachmentsForSale.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold bg-red-500 text-white border-2 border-white">
                    {attachmentsForSale.length}
                  </Badge>
                )}
              </div>
              {isExpanded && (
                <div>
                  <CardTitle className='text-base font-semibold text-gray-800'>
                    Gestión de Venta
                  </CardTitle>
                  <CardDescription className='text-sm text-gray-600'>
                    Selecciona o crea una venta para los attachments
                  </CardDescription>
                </div>
              )}
            </div>
            
            {/* Botón circular de expansión */}
            <Button
              variant='ghost'
              size='icon'
              className='w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200'
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className='h-4 w-4 text-gray-600' />
              ) : (
                <ChevronUp className='h-4 w-4 text-gray-600' />
              )}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <>
            <CardContent className='px-4 pb-3'>
              <div className='space-y-4'>
                <div className='flex gap-3'>
                  <Select
                    value={currentSale?.id?.toString() || ''}
                    onValueChange={handleSaleChange}
                    disabled={isLoading || sales.length === 0}
                  >
                    <SelectTrigger className='h-9 w-full text-sm border-gray-200 focus:border-primary'>
                      <SelectValue placeholder='Seleccionar venta' />
                    </SelectTrigger>
                    <SelectContent>
                      {sales.map((sale) => (
                        <SelectItem key={sale.id} value={sale.id.toString()}>
                          <div className='flex w-full items-center justify-between'>
                            <span className="font-medium">Venta #{sale.id}</span>
                            <Badge 
                              variant='outline' 
                              className='ml-2 text-xs px-2 py-0.5'
                            >
                              {sale.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size='sm'
                    variant='outline'
                    onClick={handleCreateSale}
                    className='h-9 w-9 shrink-0 p-0 rounded-lg border-gray-200 hover:border-primary hover:bg-primary/5'
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>

                <Separator className='my-3' />

                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <p className='text-sm font-medium text-gray-600 mb-1'>
                    Attachments para venta
                  </p>
                  <p className='text-3xl font-bold text-primary'>
                    {attachmentsForSale.length}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className='px-4 pb-4'>
              <Button
                asChild
                className='h-9 w-full text-sm font-medium'
                variant='default'
                disabled={!currentSale}
              >
                <Link to='/sales/profiles/attachments'>
                  <ExternalLink className='mr-2 h-4 w-4' />
                  Ver Detalles de Venta
                </Link>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

export default SaleFloatingPanel
