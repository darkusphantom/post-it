"use server"

import { getAuthToken } from "@/lib/auth"
import type { Post } from "@/types/wordpress"

export async function saveToNotion(post: Post, shareText: string) {
  const authToken = await getAuthToken()
  if (!authToken) {
    throw new Error("No autenticado")
  }

  const notionApiKey = process.env.NOTION_API_KEY
  const notionDatabaseId = process.env.NOTION_DATABASE_ID

  if (!notionApiKey || !notionDatabaseId) {
    throw new Error("Configuración de Notion incompleta")
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: notionDatabaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: post.title,
                },
              },
            ],
          },
          "Share Text": {
            rich_text: [
              {
                text: {
                  content: shareText,
                },
              },
            ],
          },
          URL: {
            url: `https://yourblog.com/${post.slug}`,
          },
          Status: {
            select: {
              name: "Shared",
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Error al guardar en Notion: ${JSON.stringify(error)}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error saving to Notion:", error)
    throw new Error("No se pudo guardar en Notion")
  }
}
