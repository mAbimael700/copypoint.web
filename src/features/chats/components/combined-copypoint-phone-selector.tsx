import React from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCustomerServicePhoneContext } from '@/features/chats/context/useCustomerServicePhoneContext'
import { CopypointResponse } from '@/features/copypoints/Copypoint.type'
import { CopypointSelector } from '@/features/copypoints/components/copypoint-selector'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext'
import PhoneSelector from './phone-selector'

interface CombinedCopypointPhoneSelectorProps {
  className?: string
  copypointLabel?: string
  phoneLabel?: string
  copypointPlaceholder?: string
  phonePlaceholder?: string
}

const CombinedCopypointPhoneSelector: React.FC<
  CombinedCopypointPhoneSelectorProps
> = ({
  className,
  copypointLabel = 'Copypoint',
  phoneLabel = 'Phone',
  copypointPlaceholder = 'Select copypoint',
  phonePlaceholder = 'Select phone',
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
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: 'outline' })}>
        Select phone
      </DialogTrigger>
      <DialogContent className={cn('space-y-2', className)}>
        <DialogHeader>
          <DialogTitle>Select customer service phone</DialogTitle>
          <DialogDescription>
            Choose a copypoint and select the associated customer service phone
            number to establish communication.
          </DialogDescription>
        </DialogHeader>

        <div className={'space-y-4'}>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>{copypointLabel}</p>
            <CopypointSelector
              placeholder={copypointPlaceholder}
              className='w-full'
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
      </DialogContent>
    </Dialog>
  )
}

export default CombinedCopypointPhoneSelector
