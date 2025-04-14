import { type NextRequest, NextResponse } from "next/server"
import { shareToSocialMedia } from "@/lib/social"
import { getPostBySlug } from "@/lib/wordpress"

export async function POST(request: NextRequest) {
  try {
    const { slug, shareText } = await request.json()

    if (!slug || !shareText) {
      return NextResponse.json({ success: false, message: "Faltan datos requeridos" }, { status: 400 })
    }

    const post = await getPostBySlug(slug)

    if (!post) {
      return NextResponse.json({ success: false, message: "Post no encontrado" }, { status: 404 })
    }

    // TODO: implementar para compartir en redes sociales
    // await shareToSocialMedia(post, shareText)

    return NextResponse.json({ success: true, message: "Publicación compartida exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error sharing post:", error)
    return NextResponse.json({ success: false, message: "Error al compartir publicación" }, { status: 500 })
  }
}
