"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Package, Plus, FileText, X, Upload, ImageIcon, Camera } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { toast } from "sonner"

// Tipos
interface PackageFile {
  name: string
  url: string
  type: string
}

interface PackageImage {
  id: string
  url: string
  name: string
}

interface PackageData {
  tracking: string
  clientId: string
  clientName: string
  status: string
  value: string
  registerDate: string
  lastUpdate: string
  description: string
  weight: string
  origin: string
  invoice?: PackageFile
  images?: PackageImage[]
}

// Datos de ejemplo
const mockPackages: PackageData[] = [
  {
    tracking: "TR123456789",
    clientId: "139626",
    clientName: "Carlos Pérez",
    status: "En Tránsito",
    value: "$250.00",
    registerDate: "2025-01-20",
    lastUpdate: "2025-01-20 14:30",
    description: "Electrónicos",
    weight: "2.5 kg",
    origin: "Miami, USA",
    invoice: {
      name: "factura-123.pdf",
      url: "/placeholder.svg",
      type: "application/pdf",
    },
    images: [
      {
        id: "1",
        url: "/placeholder.svg?height=300&width=400",
        name: "package-front.jpg",
      },
    ],
  },
  {
    tracking: "TR987654321",
    clientId: "139627",
    clientName: "María López",
    status: "Entregado",
    value: "$125.75",
    registerDate: "2025-01-19",
    lastUpdate: "2025-01-20 09:15",
    description: "Ropa",
    weight: "1.2 kg",
    origin: "New York, USA",
  },
]

export default function PaquetesAdminPage() {
  const [packages, setPackages] = useState(mockPackages)
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imageError, setImageError] = useState<string | null>(null)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageError(null)

    const invalidFiles = files.filter((file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)

    if (invalidFiles.length > 0) {
      setImageError("Solo se permiten imágenes de hasta 5MB")
      return
    }

    setSelectedImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRegisterPackage = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const newPackage: PackageData = {
      tracking: formData.get("tracking") as string,
      clientId: formData.get("clientId") as string,
      clientName: formData.get("clientName") as string,
      status: "Registrado",
      value: `$${formData.get("value")}`,
      registerDate: new Date().toISOString().split("T")[0],
      lastUpdate: new Date().toLocaleString(),
      description: formData.get("description") as string,
      weight: `${formData.get("weight")} kg`,
      origin: formData.get("origin") as string,
    }

    if (selectedFile) {
      newPackage.invoice = {
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        type: selectedFile.type,
      }
    }

    if (selectedImages.length > 0) {
      newPackage.images = selectedImages.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }))
    }

    setPackages([newPackage, ...packages])
    setIsRegisterOpen(false)
    setSelectedFile(null)
    setSelectedImages([])
  }

  const handleStatusChange = (tracking: string, newStatus: string) => {
    setPackages(
      packages.map((pkg) =>
        pkg.tracking === tracking ? { ...pkg, status: newStatus, lastUpdate: new Date().toLocaleString() } : pkg,
      ),
    )
  }

  const handleAddImages = (tracking: string, files: File[]) => {
    setPackages(
      packages.map((pkg) => {
        if (pkg.tracking === tracking) {
          const newImages = files.map((file, index) => ({
            id: `${Date.now()}-${index}`,
            url: URL.createObjectURL(file),
            name: file.name,
          }))
          return {
            ...pkg,
            images: [...(pkg.images || []), ...newImages],
            lastUpdate: new Date().toLocaleString(),
          }
        }
        return pkg
      }),
    )
  }

  const handleSaveEvidence = (tracking: string) => {
    // Aquí iría la lógica para guardar en el backend
    toast.success("Evidencias guardadas correctamente")
    setIsEvidenceDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Paquetes</h2>
        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Paquete
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Paquete</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegisterPackage} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tracking">Número de Tracking</Label>
                  <Input id="tracking" name="tracking" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientId">ID del Cliente</Label>
                  <Input id="clientId" name="clientId" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nombre del Cliente</Label>
                  <Input id="clientName" name="clientName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valor Declarado ($)</Label>
                  <Input id="value" name="value" type="number" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" name="weight" type="number" step="0.1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin">Origen</Label>
                  <Input id="origin" name="origin" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice">Factura</Label>
                <div className="flex items-center gap-4">
                  <Input id="invoice" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("invoice")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Factura
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
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{fileError}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Imágenes</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("images")?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Subir Imágenes
                  </Button>
                  {selectedImages.length > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md flex-1">
                      <span className="text-sm truncate">{selectedImages.length} imágenes seleccionadas</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-8 w-8"
                        onClick={() => setSelectedImages([])}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {imageError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{imageError}</AlertDescription>
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
                    setSelectedImages([])
                    setImageError(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Registrar Paquete</Button>
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
            <Input placeholder="Número de tracking" />
            <Input placeholder="ID de cliente" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Estado del paquete" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registrado">Registrado</SelectItem>
                <SelectItem value="en-transito">En Tránsito</SelectItem>
                <SelectItem value="en-bodega">En Bodega</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="retenido">Retenido</SelectItem>
              </SelectContent>
            </Select>
            <Button>Buscar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Evidencias</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.tracking}>
                  <TableCell className="font-medium">{pkg.tracking}</TableCell>
                  <TableCell>
                    {pkg.clientName} ({pkg.clientId})
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={pkg.status}
                      onValueChange={(value) => handleStatusChange(pkg.tracking, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>
                          <Badge
                            variant={
                              pkg.status === "Registrado"
                                ? "secondary"
                                : pkg.status === "En Tránsito"
                                  ? "default"
                                  : pkg.status === "En Bodega"
                                    ? "warning"
                                    : pkg.status === "Entregado"
                                      ? "success"
                                      : "destructive"
                            }
                          >
                            {pkg.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Registrado">Registrado</SelectItem>
                        <SelectItem value="En Tránsito">En Tránsito</SelectItem>
                        <SelectItem value="En Bodega">En Bodega</SelectItem>
                        <SelectItem value="Entregado">Entregado</SelectItem>
                        <SelectItem value="Retenido">Retenido</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{pkg.value}</TableCell>
                  <TableCell>{pkg.lastUpdate}</TableCell>
                  <TableCell>
                    {pkg.invoice ? (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={pkg.invoice.url} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">No disponible</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog open={isEvidenceDialogOpen} onOpenChange={setIsEvidenceDialogOpen}>
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
                              <div className="font-medium">{pkg.tracking}</div>
                            </div>
                            <div>
                              <Label>Cliente</Label>
                              <div className="font-medium">{pkg.clientName}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Subir Nuevas Imágenes</Label>
                            <div className="flex items-center gap-4">
                              <Input
                                id={`images-${pkg.tracking}`}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || [])
                                  handleAddImages(pkg.tracking, files)
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => document.getElementById(`images-${pkg.tracking}`)?.click()}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Subir Imágenes
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Imágenes ({pkg.images?.length || 0})</Label>
                            {pkg.images && pkg.images.length > 0 ? (
                              <ScrollArea className="h-[300px] rounded-md border p-4">
                                <div className="grid grid-cols-2 gap-4">
                                  {pkg.images.map((image) => (
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

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEvidenceDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={() => handleSaveEvidence(pkg.tracking)}>Guardar Evidencias</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPackage(pkg)}>
                          <Package className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalles del Paquete</DialogTitle>
                        </DialogHeader>
                        {selectedPackage && (
                          <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Tracking</Label>
                                <div className="font-medium">{selectedPackage.tracking}</div>
                              </div>
                              <div>
                                <Label>Estado</Label>
                                <div>
                                  <Badge
                                    variant={
                                      selectedPackage.status === "Registrado"
                                        ? "secondary"
                                        : selectedPackage.status === "En Tránsito"
                                          ? "default"
                                          : selectedPackage.status === "En Bodega"
                                            ? "warning"
                                            : selectedPackage.status === "Entregado"
                                              ? "success"
                                              : "destructive"
                                    }
                                  >
                                    {selectedPackage.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label>Cliente</Label>
                                <div className="font-medium">{selectedPackage.clientName}</div>
                              </div>
                              <div>
                                <Label>ID Cliente</Label>
                                <div className="font-medium">{selectedPackage.clientId}</div>
                              </div>
                              <div>
                                <Label>Valor Declarado</Label>
                                <div className="font-medium">{selectedPackage.value}</div>
                              </div>
                              <div>
                                <Label>Peso</Label>
                                <div className="font-medium">{selectedPackage.weight}</div>
                              </div>
                              <div>
                                <Label>Origen</Label>
                                <div className="font-medium">{selectedPackage.origin}</div>
                              </div>
                              <div>
                                <Label>Fecha de Registro</Label>
                                <div className="font-medium">{selectedPackage.registerDate}</div>
                              </div>
                              <div className="col-span-2">
                                <Label>Descripción</Label>
                                <div className="font-medium">{selectedPackage.description}</div>
                              </div>
                              <div className="col-span-2">
                                <Label>Última Actualización</Label>
                                <div className="font-medium">{selectedPackage.lastUpdate}</div>
                              </div>
                            </div>
                          </div>
                        )}
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

