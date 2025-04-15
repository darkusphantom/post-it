"use server"

import { getAuthToken } from "@/lib/auth"
import type { Post } from "@/types/wordpress"
import { convertHtmlToNotionBlocks, NotionBlock } from "@/lib/html-parser"

export async function saveToNotion(
  post: Post, 
  shareText: string, 
  topic: string = "👨‍💻 Programación", 
  networks: string[] = ["Linkedin", "Facebook"],
  publishDate: string = ""
) {
  const authToken = await getAuthToken()
  if (!authToken) {
    throw new Error("No autenticado")
  }

  const notionApiKey = process.env.NOTION_API_KEY
  const notionDatabaseId = process.env.NOTION_DATABASE_ID

  if (!notionApiKey) {
    throw new Error("Configuración de Notion incompleta")
  }

  try {
    // Convertir el contenido HTML del post en bloques de Notion
    const contentBlocks = await convertHtmlToNotionBlocks(post.content);

    // Crear los bloques para la respuesta de la IA
    const aiBlocks: NotionBlock[] = [
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Contenido para Redes Sociales" } }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: shareText } }]
        }
      }
    ];

    // Formatear todos los bloques para la API de Notion
    const formattedContentBlocks = contentBlocks.map(block => ({
      object: "block",
      type: block.type,
      [block.type]: block[block.type]
    }));

    const formattedAiBlocks = aiBlocks.map(block => ({
      object: "block",
      type: block.type,
      [block.type]: block[block.type]
    }));

    console.log(topic[0])
    // Estructura basada en el modelo de Angular
    const pageData = {
      parent: {
        database_id: notionDatabaseId
      },
      icon: {
        type: "emoji",
        emoji: "👨‍💻"
      },
      properties: {
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: post.title
              }
            }
          ]
        },
        "Social Network": {
          type: "multi_select",
          multi_select: networks.map(network => ({ name: network }))
        },
        "URL": {
          type: "url",
          url: `https://darkusphantom.com/${post.slug}`
        },
        "State": {
          type: "select",
          select: {
            name: "Completo",
            color: "green"
          }
        },
        "Format Type": {
          type: "select",
          select: {
            name: "✏️ Blog",
            color: "red"
          }
        },
        "Publicado": {
          type: "checkbox",
          checkbox: false
        },
        "Topic": {
          type: "multi_select",
          multi_select: [
            { name: topic }
          ]
        },
        // TODO: Integrar la fecha de publicación
        // ...(publishDate ? {
        //   "Time To Publish": {
        //     type: "date",
        //     date: {
        //       start: publishDate
        //     }
        //   }
        // } : {})
      },
      children: [
        ...formattedAiBlocks,
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{
              type: "text",
              text: { content: "Contenido Original" }
            }]
          }
        },
        ...formattedContentBlocks
      ]
    };

    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify(pageData),
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
