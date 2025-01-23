import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Código de Importador</CardTitle>
          <CardDescription>Su identificador único</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">139626</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paquetes Activos</CardTitle>
          <CardDescription>Paquetes en tránsito</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">3</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liquidaciones Pendientes</CardTitle>
          <CardDescription>Por procesar</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">2</p>
        </CardContent>
      </Card>
    </div>
  )
}

