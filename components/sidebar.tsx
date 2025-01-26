"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, Home, FileText, CreditCard, Settings, Users } from 'lucide-react'
import { LogoutButton } from "@/components/logout-button"
import { getSession } from "@/app/actions/auth"
import { useEffect, useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Route {
  href: string
  label: string
  icon: React.ReactNode
  roles: ("ADMIN" | "CLIENT")[]
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<"ADMIN" | "CLIENT" | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      const session = await getSession()
      if (session) {
        setUserRole(session.role)
      }
    }
    loadSession()
  }, [])

  const routes: Route[] = [
    {
      href: "/dashboard",
      label: "Inicio",
      icon: <Home className="mr-2 h-4 w-4" />,
      roles: ["ADMIN", "CLIENT"]
    },
    {
      href: "/dashboard/paquetes",
      label: "Paquetes",
      icon: <Package className="mr-2 h-4 w-4" />,
      roles: ["ADMIN", "CLIENT"]
    },
    {
      href: "/dashboard/liquidacion",
      label: "Liquidación",
      icon: <FileText className="mr-2 h-4 w-4" />,
      roles: ["CLIENT"]
    },
    {
      href: "/dashboard/pagos",
      label: "Pagos",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      roles: ["CLIENT"]
    },
    {
      href: "/admin/usuarios",
      label: "Usuarios",
      icon: <Users className="mr-2 h-4 w-4" />,
      roles: ["ADMIN"]
    },
    {
      href: "/admin/configuracion",
      label: "Configuración",
      icon: <Settings className="mr-2 h-4 w-4" />,
      roles: ["ADMIN"]
    }
  ]

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            Sistema Courier
          </h2>
          <ScrollArea className="px-1">
            <div className="space-y-1">
              {routes.map((route) => {
                // Solo mostrar rutas según el rol del usuario
                if (!userRole || !route.roles.includes(userRole)) return null

                return (
                  <Button
                    key={route.href}
                    variant={pathname === route.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={route.href}>
                      {route.icon}
                      {route.label}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
        <div className="px-3 py-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
