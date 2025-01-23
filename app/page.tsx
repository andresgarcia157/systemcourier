import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-white">Bienvenido a Cargo Express</h1>
        <p className="text-slate-300">Sistema de gestión de importaciones y paquetes</p>
      </div>
      <div className="space-y-4">
        <div className="space-x-4">
          <Link href="/login">
            <Button size="lg">Iniciar Sesión</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              Registrarse
            </Button>
          </Link>
        </div>
        <div className="text-center">
          <Link href="/admin/login">
            <Button variant="link" className="text-slate-300 hover:text-white">
              Acceso Administradores
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

