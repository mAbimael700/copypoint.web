import React, { useMemo, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Check, FileIcon, Info, Loader2, Plus, X, ChevronsUpDown } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { formatFileSize } from '@/features/chats/message/attachment/util/formatFileSize.ts'
import useSaleAttachment from '@/features/chats/message/attachment/hooks/useSaleAttachment.ts'
import { useAttachmentStore } from '@/features/chats/stores/attachment-store.ts'
import useSaleProfiles from '@/features/saleprofile/hooks/useSaleProfiles.ts'
import { useProfileByCopypointOperations } from '@/features/profiles/hooks/useProfiles.ts'
import { useServiceContext } from '@/features/services/context/service-module-context.tsx'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils.currency'

// Schema de validación con Zod
const saleAttachmentSchema = z.object({
  profileId: z.number().min(1, 'Debe seleccionar un perfil'),
  serviceId: z.number().min(1, 'Debe seleccionar un servicio'),
  copies: z.number().min(1, 'Debe tener al menos 1 copia'),
  useCalculatedQuantity: z.boolean(),
})

type SaleAttachmentFormData = z.infer<typeof saleAttachmentSchema>

interface SaleAttachmentFormProps {
  attachmentId: number
  onSuccess?: () => void
  trigger?: React.ReactNode
}

const SaleAttachmentForm: React.FC<SaleAttachmentFormProps> = ({
  attachmentId,
  onSuccess,
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [profileSelectorOpen, setProfileSelectorOpen] = useState(false)

  // Usar nuestro hook personalizado
  const {
    processAttachmentForSale,
    isAddingAttachment,
    isAttachmentForSale,
    removeAttachmentFromSale: removeAttachmentFromSaleApi,
  } = useSaleAttachment()

  // Store de attachments para obtener información del attachment
  const {
    attachmentsForSale,
    selectedAttachment,
    removeAttachmentFromSale,
  } = useAttachmentStore()

  // Obtener sale profiles disponibles
  const { saleProfiles } = useSaleProfiles()

  // Obtener perfiles disponibles para crear nuevos
  const { profiles: availableProfiles,
     isLoading: isLoadingAvailableProfiles } = useProfileByCopypointOperations()

  // Contexto del servicio actual
  const { currentService } = useServiceContext()

  // Configurar el formulario
  const form = useForm<SaleAttachmentFormData>({
    resolver: zodResolver(saleAttachmentSchema),
    defaultValues: {
      profileId: 0,
      serviceId: 0,
      copies: 1,
      useCalculatedQuantity: true,
    },
  })

  // Obtener el attachment seleccionado desde el store
  const attachment = useMemo(() => {
    return (
      attachmentsForSale.find((att) => att.id === attachmentId) ||
      (selectedAttachment?.id === attachmentId ? selectedAttachment : null)
    )
  }, [attachmentId, attachmentsForSale, selectedAttachment])

  // Servicios disponibles basados en el perfil seleccionado

  // Función para procesar el formulario y agregar attachment a la venta
  const handleAddAttachmentToSale = async (data: SaleAttachmentFormData) => {
    try {
      // Usar la función del hook para procesar el attachment
      await processAttachmentForSale(attachmentId, data)

      // Limpiar el formulario y cerrar el diálogo
      removeAttachmentFromSale(attachmentId)
      form.reset()
      setIsOpen(false)

      // Llamar al callback de éxito si existe
      onSuccess?.()
    } catch (_error) {
      // El error ya se maneja dentro de processAttachmentForSale
      // No es necesario hacer nada aquí
    }
  }

  // Función para enviar el formulario
  const onSubmit = async (data: SaleAttachmentFormData) => {
    await handleAddAttachmentToSale(data)
  }

  // Verificar si el attachment ya está en la venta (usando la función mejorada del hook)
  const isAttachmentInSale = isAttachmentForSale(attachmentId)

  // Buscar el perfil que tiene este attachment para mostrar información adicional
  const profileWithAttachment = useMemo(() => {
    return saleProfiles.find(
      (profile) => profile.attachment && profile.attachment.id === attachmentId
    )
  }, [saleProfiles, attachmentId])

  // Función para remover attachment de la venta
  const handleRemoveFromSale = async () => {
    try {
      if (profileWithAttachment) {
        // Si tenemos la información del perfil, usamos la función del hook para remover correctamente
        await removeAttachmentFromSaleApi({
          attachmentId,
          profileId: profileWithAttachment.profileId,
          serviceId: profileWithAttachment.service.id
        })
      } else {
        // Si no tenemos la información del perfil, usamos la función del store
        // Esto es útil para attachments que están en el store pero no en los perfiles todavía
        removeAttachmentFromSale(attachmentId)
      }
      setIsOpen(false)
      // Mostrar mensaje de éxito (opcional, ya que la función API ya lo hace)
    } catch (error) {
      // Usar toast para mostrar error en lugar de console.error
      toast.error(`Error al remover attachment: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Función para seleccionar un perfil del selector
  const handleProfileSelect = (profile: { id: number; name: string; description: string; unitPrice: number }) => {
    form.setValue('profileId', profile.id)
    form.setValue('serviceId', currentService?.id || 0)
    setProfileSelectorOpen(false)
  }

  // Función para agregar a un perfil existente
  const handleAddToExistingProfile = (profile: { profileId: number; service: { id: number }; quantity: number }) => {
    form.setValue('profileId', profile.profileId)
    form.setValue('serviceId', profile.service.id)
    form.setValue('copies', profile.quantity || 1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={isAttachmentInSale ? 'secondary' : 'outline'}
            size='sm'
          >
            {isAttachmentInSale ? (
              <>
                <Check className='mr-1 h-4 w-4' />
                En Venta
              </>
            ) : (
              <>
                <Plus className='mr-1 h-4 w-4' />
                Agregar a Venta
              </>
            )}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isAttachmentInSale
              ? 'Gestionar Attachment en Venta'
              : 'Agregar Attachment a Venta'}
          </DialogTitle>
        </DialogHeader>

        {/* Información del attachment */}
        {attachment && (
          <Card className='mb-4'>
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-2'>
                <FileIcon className='h-4 w-4' />
                <CardTitle className='text-sm'>
                  {attachment.originalName}
                </CardTitle>
              </div>
              <CardDescription className='text-xs'>
                {attachment.pages && `${attachment.pages} páginas • `}
                {attachment.fileSizeBytes &&
                  formatFileSize(attachment.fileSizeBytes)}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Estado actual */}
        {isAttachmentInSale && (
          <Alert className='mb-4'>
            <Info className='h-4 w-4' />
            <AlertDescription>
              {profileWithAttachment ? (
                <>
                  Este attachment ya está agregado al perfil
                  <strong>"{profileWithAttachment.name}"</strong>
                  en la venta actual.
                </>
              ) : (
                'Este attachment ya está agregado a la venta actual.'
              )}
            </AlertDescription>
            <Button
              variant='destructive'
              size='sm'
              className='mt-2'
              onClick={handleRemoveFromSale}
            >
              <X className='mr-1 h-4 w-4' />
              Quitar de Venta
            </Button>
          </Alert>
        )}

        {/* Formulario */}
        {!isAttachmentInSale && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>

              {/* Selector de Perfil - Permitir seleccionar existente o crear nuevo */}
              <FormField
                control={form.control}
                name='profileId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de Venta</FormLabel>

                    {/* Botón para abrir el selector de perfiles */}
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                      onClick={() => setProfileSelectorOpen(true)}
                    >
                      {field.value ? (
                        availableProfiles.find(p => p.id === field.value)?.name || 'Perfil seleccionado'
                      ) : (
                        'Seleccionar o crear perfil'
                      )}
                      <ChevronsUpDown className='h-4 w-4 opacity-50' />
                    </Button>

                    {/* Selector de perfiles disponibles */}
                    <CommandDialog open={profileSelectorOpen} onOpenChange={setProfileSelectorOpen}>
                      <CommandInput placeholder="Buscar perfiles..." className='h-9' />
                      <CommandList>
                        <CommandEmpty>No se encontraron perfiles.</CommandEmpty>

                        {/* Perfiles disponibles para crear nuevos */}
                        <CommandGroup heading="Crear nuevo perfil">
                          {isLoadingAvailableProfiles ? (
                            <CommandItem disabled>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Cargando perfiles...
                            </CommandItem>
                          ) : (
                            availableProfiles?.map((profile) => (
                              <CommandItem
                                key={profile.id}
                                value={profile.name + profile.description}
                                onSelect={() => handleProfileSelect(profile)}
                              >
                                <div className='space-y-1'>
                                  <div className='font-medium'>{profile.name}</div>
                                  <div className='text-xs text-muted-foreground'>
                                    {profile.description}
                                  </div>
                                </div>
                                <div className='ml-auto'>
                                  <Badge variant='secondary' className='text-xs'>
                                    {formatCurrency(profile.unitPrice)}
                                  </Badge>
                                </div>
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>

                        {/* Perfiles existentes en la venta */}
                        {saleProfiles && saleProfiles.length > 0 && (
                          <>
                            <CommandSeparator />
                            <CommandGroup heading="Agregar a perfil existente">
                              {saleProfiles.map((profile) => (
                                <CommandItem
                                  key={`${profile.profileId} ${profile.service.id}`}
                                  value={`${profile.service.name} - ${profile.name}`}
                                  onSelect={() => handleAddToExistingProfile(profile)}
                                >
                                  <div className='space-y-1'>
                                    <div className='font-medium'>{profile.service.name} - {profile.name}</div>
                                    <div className='text-xs text-muted-foreground'>
                                      Cantidad actual: {profile.quantity}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                      {formatCurrency(profile.subtotal)}
                                    </div>
                                  </div>
                                  <div className='ml-auto'>
                                    <Badge variant='outline' className='text-xs'>
                                      Existente
                                    </Badge>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </CommandDialog>

                    <FormDescription>
                      Selecciona un perfil existente o crea uno nuevo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Selector de Servicio */}
              <FormField
                control={form.control}
                name='serviceId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servicio</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                      disabled={!form.watch('profileId')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar servicio' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentService && (
                          <SelectItem value={currentService.id.toString()}>
                            {currentService.name}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Servicio asociado al perfil seleccionado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Número de copias */}
              <FormField
                control={form.control}
                name='copies'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Copias</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='1'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Cantidad de copias a producir
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Usar cantidad calculada */}
              <FormField
                control={form.control}
                name='useCalculatedQuantity'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Usar cantidad calculada</FormLabel>
                      <FormDescription>
                        {attachment?.pages
                          ? `Usar las ${attachment.pages} páginas calculadas del documento`
                          : 'Calcular cantidad basada en las páginas del documento'}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Botones de acción */}
              <div className='flex gap-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsOpen(false)}
                  className='flex-1'
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={isAddingAttachment}
                  className='flex-1'
                >
                  {isAddingAttachment ? (
                    <>
                      <Loader2 className='mr-1 h-4 w-4 animate-spin' />
                      Agregando...
                    </>
                  ) : (
                    <>
                      <Plus className='mr-1 h-4 w-4' />
                      Agregar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SaleAttachmentForm
