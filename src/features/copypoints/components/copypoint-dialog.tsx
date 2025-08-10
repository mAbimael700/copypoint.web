import { CheckIcon } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { CopypointResponse } from '@/features/copypoints/Copypoint.type'
import { useCopypointContext } from '@/features/copypoints/context/useCopypointContext.ts'
import useCopypoint from '@/features/copypoints/hooks/useCopypoint.ts'
import { useStoreContext } from '@/features/stores/context/useStoreContext.ts'

interface CopypointDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  selectedCopypoint?: CopypointResponse | null
  onSelectedCopypointChange?: (copypoint: CopypointResponse) => void
  storeId?: number | string
  title?: string
}

const CopypointDialog = ({
  open = false, // ✅ Valor por defecto
  onOpenChange,
  selectedCopypoint: externalSelectedCopypoint,
  onSelectedCopypointChange,
  storeId: externalStoreId,
  title = 'Copypoints',
}: CopypointDialogProps) => {
  // Contexto de store y copypoint
  const { activeStore } = useStoreContext()
  const { currentCopypoint, setCurrentCopypoint } = useCopypointContext()

  // Determinar el storeId y selectedCopypoint a usar
  const storeId = externalStoreId || activeStore?.id || 0
  const selectedCopypoint =
    externalSelectedCopypoint !== undefined
      ? externalSelectedCopypoint
      : currentCopypoint

  // Función para manejar la selección del copypoint
  const handleSelect = (copypoint: CopypointResponse) => {
    // Si hay una función externa, la usamos
    if (onSelectedCopypointChange) {
      onSelectedCopypointChange(copypoint)
    } else {
      // Si no, usamos la del contexto
      setCurrentCopypoint(copypoint)
    }
    // Cerramos el diálogo
    onOpenChange?.(false) // ✅ Uso seguro con optional chaining
  }

  // Obtener copypoints usando el hook
  const { copypoints, isLoading } = useCopypoint(storeId)

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder='Buscar copypoint...' />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        {isLoading ? (
          <div className='text-muted-foreground p-4 text-center text-sm'>
            Cargando copypoints...
          </div>
        ) : (
          <CommandGroup heading={title}>
            {copypoints?.map(
              (
                copypoint // ✅ Agregado optional chaining
              ) => (
                <CommandItem
                  key={copypoint.id}
                  value={copypoint.name}
                  onSelect={() => handleSelect(copypoint)}
                  className='flex items-center'
                >
                  {copypoint.name}
                  {selectedCopypoint?.id === copypoint.id && <CheckIcon />}
                </CommandItem>
              )
            ) || []}{' '}
            {/* ✅ Fallback en caso de que copypoints sea undefined */}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}

export default CopypointDialog
