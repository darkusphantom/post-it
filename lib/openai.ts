"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Post } from "@/types/wordpress"
import { getAuthToken } from "@/lib/auth"

export async function generateShareText(post: Post): Promise<string> {
  const authToken = await getAuthToken()
  if (!authToken) {
    throw new Error("No autenticado")
  }

  try {
    // Extraer texto plano del HTML para el prompt
    const tempElement = new DOMParser().parseFromString(post.content, "text/html")
    const textContent = tempElement.body.textContent || post.content

    const prompt = `
      Genera un texto atractivo para compartir en redes sociales sobre el siguiente artículo.
      El texto debe ser conciso (máximo 280 caracteres), llamativo y debe invitar a leer el artículo completo.
      
      Título del artículo: ${post.title}
      Contenido: ${textContent.substring(0, 500)}...
      
      Formato deseado:
      - Incluye emojis relevantes
      - Usa un tono conversacional
      - Incluye una pregunta o call-to-action
      - No uses hashtags
    `

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 150,
    })

    return text
  } catch (error) {
    console.error("Error generating share text:", error)
    throw new Error("No se pudo generar el texto para compartir")
  }
}
