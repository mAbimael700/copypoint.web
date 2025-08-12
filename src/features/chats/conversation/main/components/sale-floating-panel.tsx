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
      className={`fixed right-6 bottom-20 z-20 transition-all duration-300
       ${isExpanded ? 'w-80' : 'w-auto'}`}
    >
      <Card className='border-primary/20 shadow-lg cursor-pointer'>
        <CardHeader 
          className='p-3 pb-0'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className="relative">
                <ShoppingCart className='text-primary h-5 w-5' />
                {!isExpanded && attachmentsForSale.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                    {attachmentsForSale.length}
                  </Badge>
                )}
              </div>
              <CardTitle className='text-sm font-medium'>
                {isExpanded ? 'Gestión de Venta' : ''}
              </CardTitle>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6'
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronUp className='h-4 w-4' />
              )}
            </Button>
          </div>
          {isExpanded && (
            <CardDescription className='pt-1 text-xs'>
              Selecciona o crea una venta para los attachments
            </CardDescription>
          )}
        </CardHeader>

        {isExpanded && (
          <>
            <CardContent className='p-3'>
              <div className='space-y-3'>
                <div className='flex gap-2'>
                  <Select
                    value={currentSale?.id?.toString() || ''}
                    onValueChange={handleSaleChange}
                    disabled={isLoading || sales.length === 0}
                  >
                    <SelectTrigger className='h-8 w-full text-sm'>
                      <SelectValue placeholder='Seleccionar venta' />
                    </SelectTrigger>
                    <SelectContent>
                      {sales.map((sale) => (
                        <SelectItem key={sale.id} value={sale.id.toString()}>
                          <div className='flex w-full items-center justify-between'>
                            <span>Venta #{sale.id}</span>
                            <Badge variant='outline' className='ml-2 text-xs'>
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
                    className='h-8 w-8 shrink-0 p-0'
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>

                <Separator className='my-2' />

                <div className='space-y-1'>
                  <p className='text-xs font-medium'>Attachments para venta:</p>
                  <p className='text-2xl font-bold'>
                    {attachmentsForSale.length}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className='p-3 pt-0'>
              <Button
                asChild
                className='h-8 w-full text-xs'
                variant='default'
                disabled={!currentSale}
              >
                <Link to='/sales/profiles/attachments'>
                  <ExternalLink className='mr-1 h-3 w-3' />
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
