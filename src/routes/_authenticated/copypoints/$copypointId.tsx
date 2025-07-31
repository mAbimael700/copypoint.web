import { createFileRoute } from '@tanstack/react-router'
import CopypointManagement from '@/features/copypoints/management'

export const Route = createFileRoute('/_authenticated/copypoints/$copypointId')(
  {
    component: CopypointManagement,
    params:{
      parse: (rawParams) => ({
          copypointId: Number(rawParams.copypointId)
      })
    }
  },

)

