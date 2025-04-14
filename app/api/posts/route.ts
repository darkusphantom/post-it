import { type NextRequest, NextResponse } from "next/server"
import { getPosts } from "@/lib/wordpress"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10)

    const data = await getPosts(page)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ success: false, message: "Error al obtener posts" }, { status: 500 })
  }
}
