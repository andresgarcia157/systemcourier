import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Perfil del Importador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary/10 rounded-lg text-center">
            <div className="text-sm font-medium text-muted-foreground">Su código de importador</div>
            <div className="text-3xl font-bold text-primary">139626</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nombres</Label>
              <div className="p-2 bg-muted rounded-md">Juan</div>
            </div>
            <div className="space-y-2">
              <Label>Apellidos</Label>
              <div className="p-2 bg-muted rounded-md">Pérez</div>
            </div>
            <div className="space-y-2">
              <Label>Correo Electrónico</Label>
              <div className="p-2 bg-muted rounded-md">juan@ejemplo.com</div>
            </div>
            <div className="space-y-2">
              <Label>Cédula/RUC/Pasaporte</Label>
              <div className="p-2 bg-muted rounded-md">0900000000</div>
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <div className="p-2 bg-muted rounded-md">0900000000</div>
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <div className="p-2 bg-muted rounded-md">Av. Principal #123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

