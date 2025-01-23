"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, X, DollarSign, Plus, Search, User, CreditCard, Camera, ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

// Tipos
interface Cliente {
  id: string
  nombre: string
  email: string
}

interface PackageImage {
  id: string
  url: string
  name: string
}

interface InvoiceFile {
  name: string
  url: string
  type: string
}

interface Liquidacion {
  id: string
  date: string
  tracking: string
  clientId: string
  clientName: string
  clientEmail?: string
  value: string
  paymentAmount: string
  status: string
  description?: string
  observations?: string
  invoice?: InvoiceFile
  packageImages?: PackageImage[]
}

// Datos de ejemplo de clientes
const mockClientes: Cliente[] = [
  { id: "139626", nombre: "Carlos Pérez", email: "carlos@ejemplo.com" },
  { id: "139627", nombre: "María López", email: "maria@ejemplo.com" },
  { id: "139628", nombre: "Juan Silva", email: "juan@ejemplo.com" },
  { id: "139629", nombre: "Ana Torres", email: "ana@ejemplo.com" },
]

const mockLiquidaciones: Liquidacion[] = [
  {
    id: "LIQ001",
    date: "2025-01-20",
    tracking: "TR123456789",
    clientId: "139626",
    clientName: "Carlos Pérez",
    clientEmail: "carlos@ejemplo.com",
    value: "$250.00",
    paymentAmount: "$300.00",
    status: "Pendiente",
    description: "Importación de electrónicos",
    observations: "Cliente frecuente",
    invoice: {
      name: "liquidacion-123.pdf",
      url: "/placeholder.svg",
      type: "application/pdf",
    },
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
    date: "2025-01-19",
    tracking: "TR987654321",
    clientId: "139627",
    clientName: "María López",
    value: "$125.75",
    paymentAmount: "$150.90",
    status: "Pagada",
    description: "Importación de ropa",
    observations: "Primera importación",
    packageImages: [
      {
        id: "3",
        url: "/placeholder.svg?height=300&width=400",
        name: "evidence-1.jpg",
      },
    ],
  },
]

export default function LiquidacionesAdminPage() {
  const [liquidaciones, setLiquidaciones] = useState(mockLiquidaciones)
  const [selectedLiquidacion, setSelectedLiquidacion] = useState<Liquidacion | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [clientSearchOpen, setClientSearchOpen] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError(null)

    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("Solo se permiten archivos PDF")
        setSelectedFile(null)
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setFileError("El archivo no debe superar los 5MB")
        setSelectedFile(null)
        return
      }

      setSelectedFile(file)
    }
  }

  const handleRegisterLiquidacion = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClient) {
      alert("Debe seleccionar un cliente")
      return
    }

    const formData = new FormData(e.target as HTMLFormElement)

    const newLiquidacion: Liquidacion = {
      id: `LIQ${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      tracking: formData.get("tracking") as string,
      clientId: selectedClient.id,
      clientName: selectedClient.nombre,
      clientEmail: selectedClient.email,
      value: `$${formData.get("value")}`,
      paymentAmount: `$${formData.get("paymentAmount")}`,
      status: "Pendiente",
      description: formData.get("description") as string,
      observations: formData.get("observations") as string,
    }

    if (selectedFile) {
      newLiquidacion.invoice = {
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        type: selectedFile.type,
      }
    }

    setLiquidaciones([newLiquidacion, ...liquidaciones])
    setIsRegisterOpen(false)
    setSelectedFile(null)
    setSelectedClient(null)
  }

  const handleUploadInvoice = (liquidacionId: string) => {
    if (!selectedFile) return

    setLiquidaciones(
      liquidaciones.map((liq) => {
        if (liq.id === liquidacionId) {
          return {
            ...liq,
            invoice: {
              name: selectedFile.name,
              url: URL.createObjectURL(selectedFile),
              type: selectedFile.type,
            },
          }
        }
        return liq
      }),
    )

    setSelectedFile(null)
    setSelectedLiquidacion(null)
  }

  const handleStatusChange = (liquidacionId: string, newStatus: string) => {
    setLiquidaciones(liquidaciones.map((liq) => (liq.id === liquidacionId ? { ...liq, status: newStatus } : liq)))
  }

  const filteredLiquidaciones = liquidaciones.filter((liq) => {
    const matchesSearch =
      searchTerm === "" ||
      liq.tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
      liq.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      liq.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "" || liq.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Liquidaciones</h2>
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Liquidación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Liquidación</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegisterLiquidacion} className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clientSearchOpen}
                      className="w-full justify-between"
                    >
                      {selectedClient ? (
                        <>
                          <User className="mr-2 h-4 w-4" />
                          {selectedClient.nombre} ({selectedClient.id})
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Buscar cliente...
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar por nombre o ID..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                          {mockClientes.map((cliente) => (
                            <CommandItem
                              key={cliente.id}
                              onSelect={() => {
                                setSelectedClient(cliente)
                                setClientSearchOpen(false)
                              }}
                            >
                              <User className="mr-2 h-4 w-4" />
                              {cliente.nombre}
                              <span className="ml-2 text-muted-foreground">ID: {cliente.id}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedClient && <div className="text-sm text-muted-foreground">Email: {selectedClient.email}</div>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tracking">Número de Tracking</Label>
                  <Input id="tracking" name="tracking" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valor de Mercadería ($)</Label>
                  <Input id="value" name="value" type="number" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Valor a Pagar ($)</Label>
                  <Input id="paymentAmount" name="paymentAmount" type="number" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input id="description" name="description" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observations">Observaciones</Label>
                <Textarea id="observations" name="observations" />
              </div>
              <div className="space-y-2">
                <Label>Factura (PDF)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="registerInvoice"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("registerInvoice")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Seleccionar Factura
                  </Button>
                  {selectedFile && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md flex-1">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm truncate">{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-8 w-8"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {fileError && (
                  <Alert variant="destructive">
                    <AlertDescription>{fileError}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsRegisterOpen(false)
                    setSelectedFile(null)
                    setFileError(null)
                    setSelectedClient(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Registrar Liquidación</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar por tracking o cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Pagada">Pagada</SelectItem>
                <SelectItem value="Anulada">Anulada</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor Mercadería</TableHead>
                <TableHead>Valor a Pagar</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Evidencias</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLiquidaciones.map((liquidacion) => (
                <TableRow key={liquidacion.id}>
                  <TableCell>{liquidacion.date}</TableCell>
                  <TableCell className="font-medium">{liquidacion.tracking}</TableCell>
                  <TableCell>
                    {liquidacion.clientName} ({liquidacion.clientId})
                  </TableCell>
                  <TableCell>{liquidacion.value}</TableCell>
                  <TableCell className="font-medium text-primary">{liquidacion.paymentAmount}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={liquidacion.status}
                      onValueChange={(value) => handleStatusChange(liquidacion.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>
                          <Badge
                            variant={
                              liquidacion.status === "Pendiente"
                                ? "warning"
                                : liquidacion.status === "Pagada"
                                  ? "success"
                                  : "destructive"
                            }
                          >
                            {liquidacion.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Pagada">Pagada</SelectItem>
                        <SelectItem value="Anulada">Anulada</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {liquidacion.invoice ? (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={liquidacion.invoice.url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">No disponible</span>
                    )}
                  </TableCell>
                  <TableCell>
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
                              <Label>Cliente</Label>
                              <div className="font-medium">{liquidacion.clientName}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Imágenes ({liquidacion.packageImages?.length || 0})</Label>
                            {liquidacion.packageImages && liquidacion.packageImages.length > 0 ? (
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
                            ) : (
                              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                                No hay imágenes disponibles
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalles de Liquidación</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>ID Liquidación</Label>
                              <div className="font-medium">{liquidacion.id}</div>
                            </div>
                            <div className="space-y-2">
                              <Label>Fecha</Label>
                              <div className="font-medium">{liquidacion.date}</div>
                            </div>
                            <div className="space-y-2">
                              <Label>Cliente</Label>
                              <div className="font-medium">{liquidacion.clientName}</div>
                            </div>
                            <div className="space-y-2">
                              <Label>ID Cliente</Label>
                              <div className="font-medium">{liquidacion.clientId}</div>
                            </div>
                            <div className="space-y-2">
                              <Label>Tracking</Label>
                              <div className="font-medium">{liquidacion.tracking}</div>
                            </div>
                            <div className="space-y-2">
                              <Label>Estado</Label>
                              <Badge
                                variant={
                                  liquidacion.status === "Pendiente"
                                    ? "warning"
                                    : liquidacion.status === "Pagada"
                                      ? "success"
                                      : "destructive"
                                }
                              >
                                {liquidacion.status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <Label>Valor Mercadería</Label>
                              <div className="font-medium">{liquidacion.value}</div>
                            </div>
                            <div className="space-y-2">
                              <Label>Valor a Pagar</Label>
                              <div className="font-medium text-primary">{liquidacion.paymentAmount}</div>
                            </div>
                            {liquidacion.description && (
                              <div className="col-span-2 space-y-2">
                                <Label>Descripción</Label>
                                <div className="font-medium">{liquidacion.description}</div>
                              </div>
                            )}
                            {liquidacion.observations && (
                              <div className="col-span-2 space-y-2">
                                <Label>Observaciones</Label>
                                <div className="font-medium">{liquidacion.observations}</div>
                              </div>
                            )}
                          </div>
                          {liquidacion.invoice && (
                            <div className="space-y-2">
                              <Label>Factura</Label>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <a
                                  href={liquidacion.invoice.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {liquidacion.invoice.name}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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

