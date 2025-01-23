import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-9xl font-bold text-white">404</h1>
        <h2 className="text-2xl font-semibold text-slate-300">Página no encontrada</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button size="lg" className="mt-4">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  )
}

