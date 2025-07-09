export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...paymentKeys.lists(), { ...filters }] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: number) => [...paymentKeys.details(), id] as const,
  byCopypoint: (copypointId: number) => [...paymentKeys.lists(), { copypointId }] as const,
}
