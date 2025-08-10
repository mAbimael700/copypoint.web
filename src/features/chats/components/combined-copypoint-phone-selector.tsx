import React from 'react'
import { cn } from '@/lib/utils'
import { CopypointSelector } from '@/features/copypoints/components/copypoint-selector'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import { useCustomerServicePhoneContext } from '@/features/chats/context/useCustomerServicePhoneContext'
import PhoneSelector from './phone-selector'
import { CopypointResponse } from '@/features/copypoints/Copypoint.type'

interface CombinedCopypointPhoneSelectorProps {
  className?: string
  copypointLabel?: string
  phoneLabel?: string
  copypointPlaceholder?: string
  phonePlaceholder?: string
}

const CombinedCopypointPhoneSelector: React.FC<CombinedCopypointPhoneSelectorProps> = ({
  className,
  copypointLabel = 'Copypoint',
  phoneLabel = 'Teléfono',
  copypointPlaceholder = 'Seleccionar copypoint',
  phonePlaceholder = 'Seleccionar teléfono',
}) => {
  // Contextos
  const { setCurrentCopypoint } = useCopypointContext()
  const { setCurrentPhone } = useCustomerServicePhoneContext()

  // Handler para la selección de copypoint
  const handleCopypointSelect = (copypoint: CopypointResponse) => {
    // Actualizar el copypoint en el contexto
    setCurrentCopypoint(copypoint)
    // Resetear el teléfono cuando cambia el copypoint
    setCurrentPhone(null)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Selector de Copypoint */}
      <div className="space-y-1">
        <p className="text-sm font-medium">{copypointLabel}</p>
        <CopypointSelector 
          placeholder={copypointPlaceholder}
          className="w-full"
          onCopypointSelect={handleCopypointSelect}
        />
      </div>

      {/* Selector de Teléfono */}
      <PhoneSelector 
        label={phoneLabel}
        placeholder={phonePlaceholder}
        defaultToFirst={true}
      />
    </div>
  )
}

export default CombinedCopypointPhoneSelector

