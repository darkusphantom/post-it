"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getAuthToken } from "@/lib/auth"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si existe la cookie de autenticación
        // const hasAuthCookie = document.cookie.includes("auth-token")
                //TODO: Mejorar el auth para las cookies
        const hasAuthCookie = await getAuthToken()
        setIsAuthenticated(Boolean(hasAuthCookie))

        // Redirigir si es necesario
        if (!hasAuthCookie && pathname !== "/" && !pathname.includes("/api/")) {
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  return <AuthContext.Provider value={{ isAuthenticated, isLoading }}>{children}</AuthContext.Provider>
}
