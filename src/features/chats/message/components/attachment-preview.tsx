import React, { useState } from 'react';
import { DownloadIcon, FileAudioIcon, FileIcon, FileTextIcon, ImageIcon, VideoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAttachment } from '@/features/chats/hooks/useAttachment';
import { useAuth } from '@/stores/authStore.ts'
import AttachmentService from '@/features/chats/message/services/AttachmentService.ts'


interface AttachmentPreviewProps {
  attachmentId: number | string
  className?: string
  maxPreviewHeight?: number
  showControls?: boolean
  onDownloadClick?: () => void
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachmentId,
  className,
  maxPreviewHeight = 200,
  showControls = true,
  onDownloadClick,
}) => {
  // Estado local para prevenir múltiples descargas
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { accessToken } = useAuth()
  // Usamos solo la información básica, no las funciones que causan re-renderizados
  const {
    attachmentInfo,
    isAvailable,
    isLoadingInfo,
    isCheckingAvailability,
    fileType
  } = useAttachment(attachmentId)

  const fileName = attachmentInfo?.originalName || 'Archivo'
  const fileSize = attachmentInfo?.fileSizeBytes ? formatFileSize(attachmentInfo.fileSizeBytes) : ''

  // Manejar la descarga manualmente para evitar re-renderizados
  const handleDownload = async () => {
    if (isLoading || !isAvailable) return

    try {
      setIsLoading(true)
      if (onDownloadClick) onDownloadClick()

      // Descarga manual usando el servicio directamente


      await AttachmentService.downloadAndCreateBlobUrl(attachmentId, accessToken, fileName)
    } catch (error) {
      console.error('Error al descargar:', error)
      setLoadError(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar vista previa manualmente al hacer clic en vez de automáticamente
  const handleLoadPreview = async () => {
    if (previewUrl || isLoading || !isAvailable) return

    try {
      setIsLoading(true)

      // Descarga manual para la vista previa

      const blob = await AttachmentService.downloadAttachment(attachmentId, accessToken)
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
    } catch (error) {
      console.error('Error al cargar vista previa:', error)
      setLoadError(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Función auxiliar para formatear tamaños de archivos
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Determinar el icono según el tipo de archivo
  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className='h-6 w-6' />
      case 'video':
        return <VideoIcon className='h-6 w-6' />
      case 'audio':
        return <FileAudioIcon className='h-6 w-6' />
      case 'document':
        return <FileTextIcon className='h-6 w-6' />
      default:
        return <FileIcon className='h-6 w-6' />
    }
  }

  // Si está cargando
  if (isLoadingInfo || isCheckingAvailability) {
    return (
      <div
        className={cn(
          'flex flex-col items-center rounded border p-2',
          className
        )}
      >
        <Skeleton className='mb-2 h-6 w-6' />
        <Skeleton className='mb-1 h-4 w-24' />
        <Skeleton className='h-3 w-16' />
      </div>
    )
  }

  // Si hay un error
  if (loadError) {
    return (
      <div
        className={cn(
          'flex flex-col items-center rounded border bg-red-50 p-2 text-red-500',
          className
        )}
      >
        <FileIcon className='mb-1 h-6 w-6' />
        <p className='text-center text-xs'>Error al cargar el archivo</p>
      </div>
    )
  }

  // Si no está disponible
  if (!isAvailable) {
    return (
      <div
        className={cn(
          'flex flex-col items-center rounded border bg-amber-50 p-2',
          className
        )}
      >
        <FileIcon className='mb-1 h-6 w-6 text-amber-500' />
        <p className='text-xs font-medium'>Archivo en proceso</p>
        <p className='text-muted-foreground text-xs'>{fileName}</p>
      </div>
    )
  }

  // Si es imagen y tiene previewUrl
  if (fileType === 'image' && previewUrl) {
    return (
      <div
        className={cn(
          'group relative overflow-hidden rounded border',
          className
        )}
      >
        <img
          src={previewUrl}
          alt={fileName}
          className='w-full object-contain'
          style={{ maxHeight: maxPreviewHeight }}
        />

        {showControls && (
          <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100'>
            <Button
              size='sm'
              variant='ghost'
              className='text-white'
              onClick={handleDownload}
              disabled={isLoading}
            >
              <DownloadIcon className='mr-1 h-4 w-4' />
              Descargar
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Si es imagen pero no tiene previewUrl aún
  if (fileType === 'image' && !previewUrl) {
    return (
      <div
        className={cn(
          'group relative overflow-hidden rounded border cursor-pointer p-3',
          className
        )}
        onClick={handleLoadPreview}
      >
        <div className='flex items-center gap-2'>
          <ImageIcon className='h-5 w-5 text-blue-500' />
          <p className='truncate text-sm font-medium'>{fileName}</p>
        </div>
        <p className='mt-1 text-xs text-muted-foreground'>
          {isLoading ? 'Cargando vista previa...' : 'Clic para previsualizar'}
        </p>
      </div>
    )
  }

  // Para el resto de tipos de archivos
  return (
    <div
      className={cn(
        'flex items-center rounded border p-3 transition-colors hover:bg-gray-50',
        className
      )}
    >
      <div className='mr-3 text-blue-500'>{getFileIcon()}</div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{fileName}</p>
        <p className='text-muted-foreground text-xs'>{fileSize}</p>
      </div>
      {showControls && (
        <Button
          size='sm'
          variant='ghost'
          className='ml-2 flex-shrink-0'
          onClick={handleDownload}
          disabled={isLoading}
        >
          <DownloadIcon className='h-4 w-4' />
        </Button>
      )}
    </div>
  )

}

export default AttachmentPreview
