import { useMemo } from 'react'
import { format } from 'date-fns'
import { subDays } from 'date-fns/fp'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { useSalesTimeline, useSalesByCopypoint, usePaymentStatusDistribution, usePaymentMethodDistribution, useTopServices } from '@/features/dashboard/hooks/useDashboard'
import { formatCurrency } from '@/lib/utils.currency'
import { Loader2 } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'

export default function Dashboard() {
  // Rango de fechas por defecto: últimos 30 días
  const { startDate, endDate } = useMemo(() => {
    const end = new Date()
    const start = subDays(30)(end)
    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    }
  }, [])

  const salesTimelineQuery = useSalesTimeline({ startDate, endDate })
  const salesByCopypointQuery = useSalesByCopypoint({ startDate, endDate })
  const paymentStatusQuery = usePaymentStatusDistribution({ startDate, endDate })
  const paymentMethodQuery = usePaymentMethodDistribution({ startDate, endDate })
  const topServicesQuery = useTopServices({ startDate, endDate, limit: 5 })

  const isLoading =
    salesTimelineQuery.isLoading ||
    salesByCopypointQuery.isLoading ||
    paymentStatusQuery.isLoading ||
    paymentMethodQuery.isLoading ||
    topServicesQuery.isLoading

  const metrics = salesTimelineQuery.data?.metrics
  const successRate = paymentStatusQuery.data?.metrics.successRate

  // Paleta fija de colores (hex)
  const COLORS = {
    sales: '#6366F1', // Indigo 500
    txs: '#10B981', // Emerald 500
    revenue: '#F59E0B', // Amber 500
    top: '#3B82F6', // Blue 500
    methods: '#8B5CF6', // Violet 500
  }

  // Colores para gráfico de pastel (segmentos distintos)
  const PIE_COLORS = [
    '#6366F1', // indigo
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#3B82F6', // blue
    '#A855F7', // purple
    '#14B8A6', // teal
    '#F97316', // orange
  ]

  return (
    <Main>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground text-sm'>
          Rango: {startDate} — {endDate}
        </p>
      </div>

      {isLoading ? (
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Loader2 className='h-4 w-4 animate-spin' /> Cargando datos...
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Métricas principales */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm'>Ventas totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {metrics ? formatCurrency(metrics.totalSales) : '—'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm'>Transacciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {metrics?.totalTransactions?.toLocaleString() ?? '—'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm'>Promedio por transacción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {metrics ? formatCurrency(metrics.averagePerTransaction) : '—'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm'>Tasa de éxito</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {typeof successRate === 'number' ? `${successRate.toFixed(1)}%` : '—'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficas de línea: Ventas y Transacciones */}
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Ventas en el tiempo</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className='w-full' config={{}}>
                  <LineChart data={salesTimelineQuery.data?.timeline || []} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' tickMargin={8} />
                    <YAxis tickFormatter={(v) => `${v}`} />
                    <ChartTooltip content={<ChartTooltipContent nameKey='Ventas' labelKey='date' />} />
                    <Line type='monotone' dataKey='totalSales' stroke={COLORS.sales} strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transacciones en el tiempo</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className='w-full' config={{}}>
                  <LineChart data={salesTimelineQuery.data?.timeline || []} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' tickMargin={8} />
                    <YAxis tickFormatter={(v) => `${v}`} />
                    <ChartTooltip content={<ChartTooltipContent nameKey='Transacciones' labelKey='date' />} />
                    <Line type='monotone' dataKey='transactionCount' stroke={COLORS.txs} strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Barras: Ventas por Copypoint y Top Servicios */}
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Ventas por copypoint</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className='w-full' config={{}}>
                  <BarChart data={(salesByCopypointQuery.data?.salesByLocation || []).slice(0, 8)} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='copypointName' tickMargin={8} interval={0} angle={-25} height={60} textAnchor='end' />
                    <YAxis tickFormatter={(v) => `${v}`} />
                    <ChartTooltip content={<ChartTooltipContent nameKey='Ventas' labelKey='copypointName' />} />
                    <Bar dataKey='totalSales' fill={COLORS.revenue} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top servicios por ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className='w-full' config={{}}>
                  <BarChart data={topServicesQuery.data?.topServices || []} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='serviceName' tickMargin={8} interval={0} angle={-25} height={60} textAnchor='end' />
                    <YAxis tickFormatter={(v) => `${v}`} />
                    <ChartTooltip content={<ChartTooltipContent nameKey='Ingresos' labelKey='serviceName' />} />
                    <Bar dataKey='totalRevenue' fill={COLORS.top} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Pastel: Estado de pagos */}
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Distribución por estado de pagos</CardTitle>
              </CardHeader>
              <CardContent className='flex items-center justify-center'>
                <ChartContainer className='w-full max-w-xl' config={{}}>
                  <PieChart>
                    <Pie data={paymentStatusQuery.data?.statusDistribution || []} dataKey='count' nameKey='status' outerRadius={110} label>
                      {(paymentStatusQuery.data?.statusDistribution || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <ChartTooltip content={<ChartTooltipContent nameKey='status' />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por método de pago</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer className='w-full' config={{}}>
                  <BarChart data={paymentMethodQuery.data?.distribution || []} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='methodDescription' tickMargin={8} interval={0} angle={-25} height={60} textAnchor='end' />
                    <YAxis tickFormatter={(v) => `${v}`} />
                    <ChartTooltip content={<ChartTooltipContent nameKey='usageCount' labelKey='methodDescription' />} />
                    <Bar dataKey='usageCount' fill={COLORS.methods} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Main>
  )
}
