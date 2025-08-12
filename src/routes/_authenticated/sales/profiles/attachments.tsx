import { createFileRoute } from '@tanstack/react-router'
import AttachmentSaleManager from '@/features/chats/message/attachment/screen/AttachmentSaleManager.tsx'

export const Route = createFileRoute(
  '/_authenticated/sales/profiles/attachments',
)({
  component: AttachmentSaleManager,
})
