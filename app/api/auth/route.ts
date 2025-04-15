import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // En un entorno real, validarías contra una base de datos o servicio
    if (username === process.env.USER && password === process.env.PASSWORD) {
      const response = NextResponse.json({ success: true, message: "Autenticación exitosa" }, { status: 200 })

      // Establecer cookie de autenticación
      response.cookies.set("auth-token", "demo-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 día
        path: "/",
      })

      return response
    }

    return NextResponse.json({ success: false, message: "Credenciales inválidas" }, { status: 401 })
  } catch (error) {
    console.error("Error en autenticación:", error)
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 })
  }
}
