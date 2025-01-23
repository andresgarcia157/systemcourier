import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PaquetesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Paquete</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tracking">Número de Tracking</Label>
                <Input id="tracking" placeholder="Ingrese el número de tracking" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor de la compra</Label>
                <Input id="valor" placeholder="0.00" type="number" step="0.01" />
              </div>
            </div>
            <Button type="submit">Registrar Paquete</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mis Paquetes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>TR123456789</TableCell>
                <TableCell>En tránsito</TableCell>
                <TableCell>$150.00</TableCell>
                <TableCell>2025-01-20</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>TR987654321</TableCell>
                <TableCell>Entregado</TableCell>
                <TableCell>$75.50</TableCell>
                <TableCell>2025-01-19</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

