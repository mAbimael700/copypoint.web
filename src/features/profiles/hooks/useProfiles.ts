/**
 * Archivo de re-exportación que unifica los hooks separados
 * Esto mantiene la compatibilidad con el código existente
 */

// Re-exportar las keys para uso externo
export { profileKeys } from './profileKeys'

// Re-exportar hooks para tiendas (con mutaciones)
export {
  useProfilesByStore,
  useCreateProfile,
  useProfileByStoreOperations,
  usePrefetchProfiles,
} from './useProfilesByStore'

// Re-exportar hooks para copypoints (solo lectura)
export {
  useProfilesByCopypoint,
  useProfileByCopypointOperations,
} from './useProfilesByCopypoint'

// Export por defecto del hook principal
export { useProfileByStoreOperations as default } from './useProfilesByStore'
