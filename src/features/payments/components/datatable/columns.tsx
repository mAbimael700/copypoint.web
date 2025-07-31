import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { PaymentResponse, PaymentStatus } from '../../types/Payment.type'
import { format } from 'date-fns'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrency } from '@/lib/utils.currency.ts'


const getBadgeVariant = (status: PaymentStatus) : 'outline' | 'destructive' | 'secondary' | 'default'   => {
  const variants = {
    [PaymentStatus.PENDING]: 'outline',
    [PaymentStatus.COMPLETED]: 'success',
    [PaymentStatus.FAILED]: 'destructive',
    [PaymentStatus.REFUNDED]: 'destructive',
    [PaymentStatus.PROCESSING]: 'secondary',
  }
  return variants[status] as 'outline' | 'destructive' | 'secondary' | 'default' || 'default'
}

const getStatusText = (status: PaymentStatus) => {
  const statusTexts = {
    [PaymentStatus.PENDING]: 'Pending',
    [PaymentStatus.COMPLETED]: 'Completed',
    [PaymentStatus.FAILED]: 'Failed',
    [PaymentStatus.REFUNDED]: 'Reembolsado',
    [PaymentStatus.PROCESSING]: 'Processing',
  }
  return statusTexts[status] || 'Unknown'
}

export const columns: ColumnDef<PaymentResponse>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'sale',
    header: 'Sale',
    cell: ({ row }) => {
      const sale = row.original.sale
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium cursor-help">{`#${sale.id}`}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total: {formatCurrency(sale.total)} {sale.currency}</p>
              <p>Vendedor: {sale.userVendor.personalInfo?.firstName} {sale.userVendor.personalInfo?.lastName}</p>
              <p>Estado: {sale.status}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment method',
    cell: ({ row }) => row.original.paymentMethod,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant={getBadgeVariant(status)}>
          {getStatusText(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate" title={row.original.transactionId}>
        {row.original.transactionId}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm'),
  },
]
