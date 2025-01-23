import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, FileText, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Panel de Administración</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20 este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paquetes Activos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">345</div>
            <p className="text-xs text-muted-foreground">+12% desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquidaciones Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">-8% desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+15% este mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Usuarios Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Carlos Pérez", id: "139626", date: "2025-01-20" },
                { name: "María López", id: "139627", date: "2025-01-20" },
                { name: "Juan Silva", id: "139628", date: "2025-01-19" },
                { name: "Ana Torres", id: "139629", date: "2025-01-19" },
              ].map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Liquidaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { tracking: "TR123456789", amount: "$250.00", status: "Pendiente" },
                { tracking: "TR987654321", amount: "$125.75", status: "Completada" },
                { tracking: "TR456789123", amount: "$340.50", status: "Pendiente" },
                { tracking: "TR789123456", amount: "$180.25", status: "Completada" },
              ].map((liquidacion) => (
                <div key={liquidacion.tracking} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{liquidacion.tracking}</p>
                    <p className="text-sm text-muted-foreground">{liquidacion.amount}</p>
                  </div>
                  <span
                    className={`text-sm ${liquidacion.status === "Pendiente" ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {liquidacion.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

