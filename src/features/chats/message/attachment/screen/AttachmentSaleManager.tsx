import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ShoppingCart,
  File,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react'
import { useSaleContext } from '@/features/sales/hooks/useSaleContext'
import { useAttachmentStore } from '@/features/chats/stores/attachment-store.ts'
import useSaleProfiles from '@/features/saleprofile/hooks/useSaleProfiles.ts'
import SaleAttachmentForm from '@/features/chats/message/attachment/form/attachment-sale-form.tsx'
import AttachmentPreview from '@/features/chats/message/attachment/components/attachment-preview.tsx'
import { Main } from '@/components/layout/main.tsx'
import { Header } from '@/components/layout/header'


const AttachmentSaleManager: React.FC = () => {
  const { currentSale } = useSaleContext()
  const {
    attachmentsForSale,
    selectedAttachment,
    removeAttachmentFromSale,
    clearAttachmentsForSale
  } = useAttachmentStore()

  const {
    saleProfiles,
    isLoading: isLoadingProfiles,
    refetch
  } = useSaleProfiles()

  // Calcular totales
  const totalAttachments = attachmentsForSale.length
  const totalProfilesWithAttachments = saleProfiles.filter(p => p.attachment).length

  // Función para limpiar todos los attachments
  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres quitar todos los attachments de la venta?')) {
      clearAttachmentsForSale()
    }
  }

  // Función helper para formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  return (

    <>
      <Header>
        <div className=''>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className='text-xl font-bold'>Gestión de Attachments en Venta</span>
            </div>
            {totalAttachments > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpiar Todo
              </Button>
            )}
          </div>
          <div className='text-sm text-muted-foreground'>
            Venta #{currentSale?.id} - {totalAttachments} attachment(s) seleccionado(s)
          </div>
        </div>
      </Header>

      <Main className="space-y-6">
        {/* Header con información general */}
        <Card>


          {/* Estadísticas rápidas */}
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalAttachments}
                </div>
                <div className="text-sm text-muted-foreground">
                  Attachments Seleccionados
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {totalProfilesWithAttachments}
                </div>
                <div className="text-sm text-muted-foreground">
                  Profiles con Attachment
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {saleProfiles.reduce((acc, p) => acc + (p.subtotal || 0), 0).toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Estimado
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Attachments seleccionados para venta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attachments Seleccionados</CardTitle>
              <CardDescription>
                Attachments que serán incluidos en esta venta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attachmentsForSale.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay attachments seleccionados</p>
                  <p className="text-sm">Los attachments aparecerán aquí cuando los agregues a la venta</p>
                </div>
              ) : (
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {attachmentsForSale.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <File className="h-8 w-8 text-blue-500 flex-shrink-0" />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {attachment.originalName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {attachment.fileType}
                            </Badge>
                            {attachment.pages && (
                              <Badge variant="outline" className="text-xs">
                                {attachment.pages} páginas
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <SaleAttachmentForm
                            attachmentId={attachment.id}
                            onSuccess={refetch}
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachmentFromSale(attachment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Sale Profiles actuales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items de Venta Actuales</CardTitle>
              <CardDescription>
                Profiles configurados en esta venta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProfiles ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Cargando profiles...</p>
                </div>
              ) : saleProfiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay items en esta venta</p>
                  <p className="text-sm">Agrega attachments para crear items de venta</p>
                </div>
              ) : (
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {saleProfiles.map((profile) => (
                      <div
                        key={`${profile.profileId}-${profile.service.id}`}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{profile.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {profile.service.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatPrice(profile.subtotal)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {profile.quantity} × {formatPrice(profile.unitPrice)}
                            </div>
                          </div>
                        </div>

                        {profile.attachment && (
                          <div className="mt-2 p-2 bg-muted rounded border-l-2 border-l-green-500">
                            <div className="flex items-center gap-2 text-sm">
                              <File className="h-4 w-4 text-green-600" />
                              <span className="font-medium">
                                {profile.attachment.originalName}
                              </span>
                              {profile.attachment.pages && (
                                <Badge variant="outline" className="text-xs">
                                  {profile.attachment.pages} págs
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Attachment seleccionado actualmente */}
        {selectedAttachment && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attachment Seleccionado</CardTitle>
              <CardDescription>
                Usa el formulario para agregar este attachment a la venta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <AttachmentPreview
                    attachmentId={selectedAttachment.id}
                    maxPreviewHeight={150}
                    showControls={true}
                  />
                </div>
                <div className="flex-shrink-0">
                  <SaleAttachmentForm
                    attachmentId={selectedAttachment.id}
                    onSuccess={refetch}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}

export default AttachmentSaleManager