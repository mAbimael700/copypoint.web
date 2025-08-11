import React from 'react'
import { useAttachmentStore } from '@/features/chats/stores/attachment-store'
import { Button } from '@/components/ui/button'
import { FileIcon, ShoppingCartIcon } from 'lucide-react'

interface AttachmentCounterProps {
  onClick?: () => void
}

/**
 * Componente que muestra un contador de los attachments añadidos para venta
 * y sirve como botón para navegar a la vista de checkout/sale
 */
const AttachmentCounter: React.FC<AttachmentCounterProps> = ({ onClick }) => {
  // Obtener el número de attachments para venta del store
  const attachmentsCount = useAttachmentStore(state => state.attachmentsForSale.length)

  // Si no hay attachments, no mostrar nada
  if (attachmentsCount === 0) return null

  return (
    <Button 
      variant="secondary"
      size="sm"
      className="fixed bottom-4 right-4 shadow-lg rounded-full z-50 py-5 px-4"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <FileIcon className="h-4 w-4" />
        <span>{attachmentsCount}</span>
        <ShoppingCartIcon className="h-4 w-4" />
      </div>
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        {attachmentsCount}
      </div>
    </Button>
  )
}

export default AttachmentCounter
