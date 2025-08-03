import React from 'react'
import { MpHandshakePlumaVerticalIcon } from '@/assets/mercado-pago/icons/icons.tsx'
import { MessagesSquare } from 'lucide-react'
import { LinkProps } from '@tanstack/react-router'

export const integrations: Integration[] = [
  {
    name: 'Mercado Pago Checkout',
    logo: <MpHandshakePlumaVerticalIcon className={'fill-primary'} />,
    isActive: false,
    type: 'payment',
    to: '/copypoints/integrations/add/mercadopago-config',
    desc: 'Connect with Mercado Pago Checkout for online payments.',
  },
  {
    name: 'WhatsApp Business API',
    logo: <MessagesSquare strokeWidth={1.5} />,
    isActive: false,
    type: 'messaging',
    desc: 'Connect with WhatsApp Business API for real-time communication.',
  },
]

type Integration = {
  name: string
  logo: React.ReactNode
  isActive: boolean
  desc: string
  type: IntegrationType
  to?: LinkProps['to']
}

type IntegrationType = 'payment' | 'messaging'