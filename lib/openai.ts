"use server"

import OpenAI from "openai"
import type { Post } from "@/types/wordpress"
import { getAuthToken } from "@/lib/auth"

// Función simple para extraer texto de HTML
function stripHtml(html: string): string {
  // Eliminar todas las etiquetas HTML
  return html.replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Configuramos el cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY
});

export async function generateShareText(post: Post): Promise<string> {
  const authToken = await getAuthToken()
  if (!authToken) {
    throw new Error("No autenticado")
  }

  try {
    // Extraer texto plano del HTML para el prompt
    const textContent = stripHtml(post.content);

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150
    });

    return completion.choices[0].message.content || "";
  } catch (error: any) {
    console.error("Error generating share text:", error)
    
    // Verificar si es un error de región no soportada
    if (error?.code === 'unsupported_country_region_territory') {
      throw new Error("Tu región geográfica no está soportada por OpenAI")
    }
    
    // Verificar si es un error de límite de facturación
    if (error?.code === 'insufficient_quota' || 
        error?.error?.type === 'insufficient_quota' || 
        error?.error?.code === 'billing_hard_limit_reached') {
      throw new Error("Se ha alcanzado el límite de peticiones disponibles")
    }
    
    throw new Error("No se pudo generar el texto para compartir")
  }
}
