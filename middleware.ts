import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/register", "/admin/login"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Si hay sesión y la ruta es pública, redirigir según el rol
  if (session && isPublicRoute) {
    try {
      const sessionData = JSON.parse(session.value)
      const redirectUrl = sessionData.role === "ADMIN" ? "/admin" : "/dashboard"
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch (error) {
      // Si hay error al parsear la sesión, eliminarla
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("session")
      return response
    }
  }

  // Si no hay sesión y la ruta no es pública, redirigir a login
  if (!session && !isPublicRoute) {
    // Si es una ruta de admin, redirigir a admin login
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    // Para otras rutas, redirigir al login normal
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
