"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Trash2, Package, FileText } from "lucide-react"
import { nanoid } from "nanoid"

// Tipos
interface Usuario {
  id: string
  name: string
  email: string
  phone: string
  status: string
  cedula: string
  address: string
  registerDate: string
  lastLogin: string
  packages: {
    tracking: string
    status: string
    value: string
  }[]
  liquidations: {
    id: string
    date: string
    status: string
    amount: string
  }[]
}

// Datos de ejemplo
const mockUsers: Usuario[] = [
  {
    id: "100001",
    name: "Carlos Pérez",
    email: "carlos@ejemplo.com",
    phone: "0900000000",
    status: "Activo",
    cedula: "0950903187",
    address: "Urb. Villa Club Etapa Doral Mz 3 V 34",
    registerDate: "2025-01-15",
    lastLogin: "2025-01-20 14:30",
    packages: [
      { tracking: "TR123456789", status: "En Tránsito", value: "$250.00" },
      { tracking: "TR987654321", status: "Entregado", value: "$125.75" },
    ],
    liquidations: [
      { id: "LIQ001", date: "2025-01-20", status: "Pendiente", amount: "$250.00" },
      { id: "LIQ002", date: "2025-01-19", status: "Pagada", amount: "$125.75" },
    ],
  },
  {
    id: "100002",
    name: "María López",
    email: "maria@ejemplo.com",
    phone: "0900000001",
    status: "Activo",
    cedula: "0950903188",
    address: "Av. Principal 123",
    registerDate: "2025-01-16",
    lastLogin: "2025-01-20 15:45",
    packages: [{ tracking: "TR456789123", status: "En Tránsito", value: "$340.50" }],
    liquidations: [{ id: "LIQ003", date: "2025-01-20", status: "Pendiente", amount: "$340.50" }],
  },
]

export default function UsuariosPage() {
  const [users, setUsers] = useState<Usuario[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newUser: Usuario = {
      id: (Number(users[0]?.id || "100000") + 1).toString(),
      name: `${formData.get("nombres")} ${formData.get("apellidos")}`,
      email: formData.get("email") as string,
      phone: formData.get("telefono") as string,
      status: "Activo",
      cedula: formData.get("cedula") as string,
      address: formData.get("direccion") as string,
      registerDate: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toLocaleString(),
      packages: [],
      liquidations: [],
    }

    setUsers([newUser, ...users])
    setIsAddUserOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>Agregar Usuario</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input id="nombres" name="nombres" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input id="apellidos" name="apellidos" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula/RUC/Pasaporte</Label>
                <Input id="cedula" name="cedula" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" name="direccion" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Usuario</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Buscar por nombre, ID o correo..." className="max-w-sm" />
            <Button>Buscar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Activo" ? "success" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Detalles del Usuario</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <Tabs defaultValue="info" className="w-full">
                              <TabsList>
                                <TabsTrigger value="info">Información Personal</TabsTrigger>
                                <TabsTrigger value="packages">Paquetes</TabsTrigger>
                                <TabsTrigger value="liquidations">Liquidaciones</TabsTrigger>
                              </TabsList>

                              <TabsContent value="info" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">ID de Usuario</h4>
                                    <p>{selectedUser.id}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Nombre Completo</h4>
                                    <p>{selectedUser.name}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Correo Electrónico</h4>
                                    <p>{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Teléfono</h4>
                                    <p>{selectedUser.phone}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Cédula/RUC</h4>
                                    <p>{selectedUser.cedula}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Estado</h4>
                                    <Badge variant={selectedUser.status === "Activo" ? "success" : "secondary"}>
                                      {selectedUser.status}
                                    </Badge>
                                  </div>
                                  <div className="col-span-2">
                                    <h4 className="font-medium text-sm text-muted-foreground">Dirección</h4>
                                    <p>{selectedUser.address}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Fecha de Registro</h4>
                                    <p>{selectedUser.registerDate}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Último Acceso</h4>
                                    <p>{selectedUser.lastLogin}</p>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="packages">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Paquetes del Usuario</h3>
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Tracking</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Valor</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedUser.packages.map((pkg) => (
                                        <TableRow key={pkg.tracking}>
                                          <TableCell>{pkg.tracking}</TableCell>
                                          <TableCell>
                                            <Badge
                                              variant={
                                                pkg.status === "En Tránsito"
                                                  ? "default"
                                                  : pkg.status === "Entregado"
                                                    ? "success"
                                                    : "secondary"
                                              }
                                            >
                                              {pkg.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{pkg.value}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>

                              <TabsContent value="liquidations">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Liquidaciones del Usuario</h3>
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Monto</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedUser.liquidations.map((liq) => (
                                        <TableRow key={liq.id}>
                                          <TableCell>{liq.id}</TableCell>
                                          <TableCell>{liq.date}</TableCell>
                                          <TableCell>
                                            <Badge
                                              variant={
                                                liq.status === "Pendiente"
                                                  ? "warning"
                                                  : liq.status === "Pagada"
                                                    ? "success"
                                                    : "secondary"
                                              }
                                            >
                                              {liq.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{liq.amount}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

