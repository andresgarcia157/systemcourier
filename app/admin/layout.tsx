"use client"

import { Button } from "@/components/ui/button"
import { Users, Package, FileText, Settings, LogOut, BarChart } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const authStatus = localStorage.getItem("adminAuth")
    if (!authStatus && pathname !== "/admin/login") {
      router.push("/admin/login")
    } else if (authStatus) {
      setIsAuthenticated(true)
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    setIsAuthenticated(false)
    router.push("/admin/login")
  }

  // Si es la página de login, no mostrar el layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Cargo Express Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Administrador</span>
              <Button variant="ghost" size="icon" className="text-white hover:text-white" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {isAuthenticated && (
          <aside className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
            <nav className="p-4 space-y-2">
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/usuarios">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Usuarios
                </Button>
              </Link>
              <Link href="/admin/paquetes">
                <Button variant="ghost" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Paquetes
                </Button>
              </Link>
              <Link href="/admin/liquidaciones">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Liquidaciones
                </Button>
              </Link>
              <Link href="/admin/configuracion">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Button>
              </Link>
            </nav>
          </aside>
        )}

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

