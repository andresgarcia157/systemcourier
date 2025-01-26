"use client"

import { useState, useEffect } from "react"
import { processPayment } from "@/app/actions/payments"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Package {
  id: string
  tracking: string
  description?: string
  value: number
}

interface Invoice {
  id: string
  name: string
  url: string
}

interface Liquidation {
  id: string
  amount: number
  status: "PENDING" | "PAID" | "CANCELLED"
  packageId: string
  package: Package
  invoice?: Invoice
  createdAt: string
  updatedAt: string
}

export default function LiquidacionPage() {
  const [loading, setLoading] = useState(false)
  const [liquidations, setLiquidations] = useState<Liquidation[]>([])
  const [selectedLiquidation, setSelectedLiquidation] = useState<Liquidation | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchLiquidations()
  }, [])

  const fetchLiquidations = async () => {
    try {
      const response = await fetch('/api/liquidations')
      const data = await response.json()
      if (data.success) {
        setLiquidations(data.liquidations)
      } else {
        toast.error("Error al cargar las liquidaciones")
      }
    } catch (error) {
      console.error("Error fetching liquidations:", error)
      toast.error("Error al cargar las liquidaciones")
    }
  }

  const handlePayment = async (formData: FormData) => {
    try {
      setLoading(true)
      const response = await processPayment(formData)

      if (response.success) {
        toast.success("Pago procesado exitosamente")
        setDialogOpen(false)
        fetchLiquidations() // Recargar la lista
      } else {
        toast.error(response.message || "Error al procesar el pago")
      }
    } catch (error) {
      console.error("Error en el pago:", error)
      toast.error("Error al procesar el pago")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pagado'
      case 'PENDING':
        return 'Pendiente'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liquidaciones</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Lista de Liquidaciones</CardTitle>
          <CardDescription>
            Gestione sus liquidaciones y procese los pagos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liquidations.map((liquidation) => (
                <TableRow key={liquidation.id}>
                  <TableCell className="font-medium">
                    {liquidation.package.tracking}
                  </TableCell>
                  <TableCell>
                    {liquidation.package.description || 'Sin descripción'}
                  </TableCell>
                  <TableCell>{formatDate(liquidation.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(liquidation.amount)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(liquidation.status)}`}>
                      {getStatusText(liquidation.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {liquidation.invoice && (
                      <a 
                        href={liquidation.invoice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Ver Factura
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {liquidation.status === 'PENDING' && (
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLiquidation(liquidation)}
                          >
                            Procesar Pago
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Procesar Pago</DialogTitle>
                            <DialogDescription>
                              Complete los detalles del pago para la liquidación del paquete {selectedLiquidation?.package.tracking}
                            </DialogDescription>
                          </DialogHeader>
                          <form action={handlePayment} className="space-y-4">
                            <input
                              type="hidden"
                              name="liquidationId"
                              value={selectedLiquidation?.id}
                            />
                            <div className="space-y-2">
                              <Label htmlFor="amount">Monto a Pagar</Label>
                              <Input
                                id="amount"
                                name="amount"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                defaultValue={selectedLiquidation?.amount}
                                required
                              />
                            </div>
                            <Button 
                              type="submit" 
                              disabled={loading}
                              className="w-full"
                            >
                              {loading ? "Procesando..." : "Confirmar Pago"}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {liquidations.length === 0 && (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No hay liquidaciones disponibles</p>
        </div>
      )}
    </div>
  )
}
