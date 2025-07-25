"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Main } from "@/components/layout/main"
import MercadoPagoAddPaymentBtn from "@/features/mercadopago-payment/components/input/mercado-pago-add-payment-btn"
import SaleProfileSimpleList from "@/features/saleprofile/components/sale-profile-simple-list"
import useSaleProfiles from "@/features/saleprofile/hooks/useSaleProfiles"
import { useSaleContext } from "@/features/sales/hooks/useSaleContext"
import { CreditCard, Wallet, DollarSign, Clock, User, ShoppingCart } from "lucide-react"

// Función para formatear moneda (ajusta según tu configuración)
const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency,
  }).format(amount)
}


const PaymentMutate = () => {
  const { saleProfiles } = useSaleProfiles()
  const { currentSale } = useSaleContext()

  // Calcular totales (ajusta según tu lógica de negocio)
  const totalSale = currentSale?.total || 0
  const totalPaid = 0 // Aquí deberías calcular el total ya pagado
  const pendingAmount = totalSale - totalPaid

  const handleCashPayment = () => {
    // Aquí implementarías la lógica para pago por caja
    console.log("Procesando pago por caja...")
  }

  if (!currentSale) {
    return (
      <Main>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No hay venta seleccionada</p>
          </CardContent>
        </Card>
      </Main>
    )
  }

  return (
    <Main>
      <div className="space-y-6">
        {/* Header con información de la venta */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Add payment</CardTitle>
                <CardDescription>Process payment for sale #{currentSale.id}</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {currentSale.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Vendor name</p>
                  <p className="font-medium">
                    {currentSale.userVendor?.personalInfo?.firstName}
                    {" "}{currentSale.userVendor?.personalInfo?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Sale</p>
                  <p className="font-medium">{formatCurrency(totalSale, currentSale.currency)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Payed</p>
                  <p className="font-medium text-green-600">{formatCurrency(totalPaid, currentSale.currency)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="font-medium text-orange-600">{formatCurrency(pendingAmount, currentSale.currency)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opciones de pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment method</span>
            </CardTitle>
            <CardDescription>Select payment method you want to use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pago por Caja/App */}
              <Card className="border-2 border-dashed border-muted-foreground hover:border-blue-300 transition-colors">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Cash payment</h3>
                      <p className="text-sm text-muted-foreground">Process payment directly in Copypoint app</p>
                    </div>
                    <Button onClick={handleCashPayment} className="w-full" size="lg">
                      <Wallet className="h-4 w-4 mr-2" />
                      Pay in cash register
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pago por MercadoPago */}
              <Card className="border-2 border-dashed border-muted-foreground hover:border-green-300 transition-colors">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">MercadoPago</h3>
                      <p className="text-sm text-muted-foreground">Pay with credit or debit card</p>
                    </div>
                    <MercadoPagoAddPaymentBtn className="w-full"/>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-accent rounded-lg text-accent-foreground">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-blue-600">Important information:</p>
                  <ul className="mt-1  space-y-1">
                    <li>• Cash register payment will proceed immediately</li>
                    <li>• MercadoPago can take minutes for confirming the payment</li>
                    <li>• You can make partial payments if is necessary</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la venta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Sale details</span>
            </CardTitle>
            <CardDescription>Profiles for sale #{currentSale.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <SaleProfileSimpleList saleProfiles={saleProfiles} />

            {/* Resumen de totales */}
            <div className="mt-6 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totalSale, currentSale.currency)}</span>
                </div>
                {currentSale.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento ({currentSale.discount}%):</span>
                    <span>-{formatCurrency((totalSale * currentSale.discount) / 100, currentSale.currency)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-orange-600">{formatCurrency(pendingAmount, currentSale.currency)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}

export default PaymentMutate
