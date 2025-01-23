"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Loader2, Camera, ImageIcon } from "lucide-react"
import { processPayment } from "@/app/actions/payment"
import { toast } from "sonner"
import { formatCardNumber, formatExpiry } from "@/lib/utils/validate-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface PackageImage {
  id: string
  url: string
  name: string
}

// Datos de ejemplo
const mockLiquidaciones = [
  {
    id: "LIQ001",
    fecha: "2025-01-20",
    tracking: "TR123456789",
    contenido: "Electrónicos",
    total: "$250.00",
    estado: "Pendiente",
    packageImages: [
      {
        id: "1",
        url: "/placeholder.svg?height=300&width=400",
        name: "package-front.jpg",
      },
      {
        id: "2",
        url: "/placeholder.svg?height=300&width=400",
        name: "package-back.jpg",
      },
    ],
  },
  {
    id: "LIQ002",
    fecha: "2025-01-19",
    tracking: "TR987654321",
    contenido: "Ropa",
    total: "$125.75",
    estado: "Pagado",
    packageImages: [
      {
        id: "3",
        url: "/placeholder.svg?height=300&width=400",
        name: "evidence-1.jpg",
      },
    ],
  },
]

export default function LiquidacionPage() {
  const [selectedLiquidations, setSelectedLiquidations] = useState<Set<string>>(new Set())
  const [showCheckout, setShowCheckout] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  // Calculate total of selected liquidations
  const selectedTotal = useMemo(() => {
    return Array.from(selectedLiquidations).reduce((total, id) => {
      const liquidacion = mockLiquidaciones.find((l) => l.id === id)
      if (liquidacion) {
        const amount = Number.parseFloat(liquidacion.total.replace("$", ""))
        return total + amount
      }
      return total
    }, 0)
  }, [selectedLiquidations])

  const handleLiquidationSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedLiquidations)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedLiquidations(newSelected)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value)
    } else if (name === "expiry") {
      formattedValue = formatExpiry(value)
    } else if (name === "cvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))
  }

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const selectedItems = Array.from(selectedLiquidations).map((id) => {
        const liquidacion = mockLiquidaciones.find((l) => l.id === id)
        return {
          id,
          description: `Liquidación #${id} - ${liquidacion?.contenido}`,
          amount: Number.parseFloat(liquidacion?.total.replace("$", "") || "0"),
        }
      })

      const formDataToSend = new FormData()
      formDataToSend.append("cardNumber", formData.cardNumber)
      formDataToSend.append("expiry", formData.expiry)
      formDataToSend.append("cvc", formData.cvc)
      formDataToSend.append("name", formData.name)
      formDataToSend.append("amount", selectedTotal.toString())
      formDataToSend.append("orderId", `ORD-${Date.now()}`)
      formDataToSend.append("items", JSON.stringify(selectedItems))

      const response = await processPayment(formDataToSend)

      if (response.success) {
        toast.success("Pago procesado exitosamente")
        setShowCheckout(false)
        setSelectedLiquidations(new Set())
      } else {
        toast.error(response.error || "Error al procesar el pago")
      }
    } catch (error) {
      toast.error("Error al procesar el pago")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buscar Liquidación</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tracking">Número de Tracking</Label>
                <Input id="tracking" placeholder="Ingrese el número de tracking" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input id="descripcion" placeholder="Descripción del paquete" />
              </div>
            </div>
            <Button type="submit">Buscar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liquidaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Seleccionar</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Contenido</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Evidencias</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLiquidaciones.map((liquidacion) => (
                <TableRow key={liquidacion.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLiquidations.has(liquidacion.id)}
                      onCheckedChange={(checked) => handleLiquidationSelect(liquidacion.id, checked as boolean)}
                      disabled={liquidacion.estado !== "Pendiente"}
                    />
                  </TableCell>
                  <TableCell>{liquidacion.fecha}</TableCell>
                  <TableCell>{liquidacion.tracking}</TableCell>
                  <TableCell>{liquidacion.contenido}</TableCell>
                  <TableCell className="font-medium">{liquidacion.total}</TableCell>
                  <TableCell>
                    <Badge variant={liquidacion.estado === "Pendiente" ? "warning" : "success"}>
                      {liquidacion.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {liquidacion.packageImages && liquidacion.packageImages.length > 0 ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Camera className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Evidencias del Paquete</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Tracking</Label>
                                <div className="font-medium">{liquidacion.tracking}</div>
                              </div>
                              <div>
                                <Label>Contenido</Label>
                                <div className="font-medium">{liquidacion.contenido}</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Imágenes ({liquidacion.packageImages.length})</Label>
                              <ScrollArea className="h-[300px] rounded-md border p-4">
                                <div className="grid grid-cols-2 gap-4">
                                  {liquidacion.packageImages.map((image) => (
                                    <div
                                      key={image.id}
                                      className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border bg-muted"
                                      onClick={() => {
                                        setSelectedImageUrl(image.url)
                                        setShowImageDialog(true)
                                      }}
                                    >
                                      <Image
                                        src={image.url || "/placeholder.svg"}
                                        alt={image.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <ImageIcon className="h-8 w-8 text-white" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-muted-foreground text-sm">No disponible</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedLiquidations.size > 0 && (
        <div className="fixed bottom-6 right-6 flex gap-4 items-center bg-background border rounded-lg p-4 shadow-lg">
          <div className="text-sm">
            <div className="font-medium">Liquidaciones seleccionadas: {selectedLiquidations.size}</div>
            <div className="text-2xl font-bold text-primary">Total: ${selectedTotal.toFixed(2)}</div>
          </div>
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <CreditCard className="h-4 w-4" />
                Proceder al pago
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Checkout de Pago</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm font-medium">Resumen de Pago</div>
                  <div className="mt-2 space-y-2">
                    {Array.from(selectedLiquidations).map((id) => {
                      const liq = mockLiquidaciones.find((l) => l.id === id)
                      return liq ? (
                        <div key={id} className="flex justify-between text-sm">
                          <span>Liquidación #{liq.id}</span>
                          <span>{liq.total}</span>
                        </div>
                      ) : null
                    })}
                    <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                      <span>Total a Pagar</span>
                      <span className="text-primary">${selectedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Fecha de Expiración</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">Código de Seguridad</Label>
                      <Input
                        id="cvc"
                        name="cvc"
                        placeholder="CVC"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre en la Tarjeta</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nombre completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowCheckout(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      `Pagar $${selectedTotal.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vista Previa</DialogTitle>
          </DialogHeader>
          {selectedImageUrl && (
            <div className="relative aspect-video">
              <Image src={selectedImageUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

