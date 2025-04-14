"use server"

import { cookies } from "next/headers"

// En un entorno real, esto debería validar contra una API o base de datos
// Por ahora, usamos una validación simple para demostración
export async function login(username: string, password: string) {
  // Simulación de validación
  if (username === "admin" && password === "password") {
    // En producción, deberías usar un token JWT o similar
    const cookieStore = await cookies()
    cookieStore.set("auth-token", "demo-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    })
    return true
  }

  throw new Error("Credenciales inválidas")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get("auth-token")?.value
}
