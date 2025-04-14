import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import path from "path"

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")
  const { pathname } = request.nextUrl

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ["/dashboard"]

  // Verificar si es la ruta de post pero permitir visualización de posts individuales
  const isPostRoute = pathname.startsWith("/post")
  const isPostDetailRoute = pathname.match(/^\/post\/[^\/]+$/) !== null

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route)) ||
    (isPostRoute && !isPostDetailRoute)

  // Redirigir a login si no hay token y la ruta está protegida
  if (isProtectedRoute && !authToken) {
    const url = new URL("/", request.url)
    return NextResponse.redirect(url)
  }

  // Redirigir al dashboard si ya está autenticado y va a la página principal
  if (pathname === "/" && authToken) {
    const url = new URL("/dashboard", request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api routes that don't require auth
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
  ],
}
