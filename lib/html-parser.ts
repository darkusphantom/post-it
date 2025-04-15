"use server"

// Tipo para los bloques de Notion
export interface NotionBlock {
  type: string;
  [key: string]: any;
}

/**
 * Convierte HTML a bloques de Notion usando técnicas de parseo de regex
 * Ya que no tenemos acceso a DOM en el servidor, usamos regex para extraer elementos
 * pero preservando el orden original del contenido
 */
export async function convertHtmlToNotionBlocks(html: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  const MAX_BLOCKS = 95; // Límite de bloques para Notion
  
  // Limpiamos el HTML para que sea más fácil de procesar
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  
  // Para preservar el orden del contenido, vamos a procesar el HTML de manera secuencial
  // Primero extraemos los elementos principales (top-level)
  const topLevelRegex = /<(h[1-6]|p|ul|ol|blockquote|div)[^>]*>([\s\S]*?)<\/\1>/gi;
  let topLevelMatch;
  
  while ((topLevelMatch = topLevelRegex.exec(cleanHtml)) !== null && blocks.length < MAX_BLOCKS) {
    const tagName = topLevelMatch[1].toLowerCase();
    const content = topLevelMatch[2];
    
    // Procesar según el tipo de elemento
    if (tagName.startsWith('h')) {
      // Es un encabezado (h1-h6)
      const level = tagName.charAt(1);
      const strippedContent = await stripHtml(content);
      
      if (strippedContent.trim()) {
        // Dividir en chunks si es necesario
        const chunks = splitTextIntoChunks(strippedContent.trim(), 2000);
        
        for (const chunk of chunks) {
          if (blocks.length < MAX_BLOCKS) {
            blocks.push({
              type: `heading_${level}`,
              [`heading_${level}`]: {
                rich_text: [{ type: "text", text: { content: chunk } }]
              }
            });
          }
        }
      }
    } else if (tagName === 'p') {
      // Es un párrafo
      const strippedContent = await stripHtml(content);
      
      if (strippedContent.trim()) {
        // Dividir en chunks si es necesario
        const chunks = splitTextIntoChunks(strippedContent.trim(), 2000);
        
        for (const chunk of chunks) {
          if (blocks.length < MAX_BLOCKS) {
            blocks.push({
              type: "paragraph",
              paragraph: {
                rich_text: [{ type: "text", text: { content: chunk } }]
              }
            });
          }
        }
      }
    } else if (tagName === 'ul') {
      // Es una lista desordenada
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      
      while ((liMatch = liRegex.exec(content)) !== null && blocks.length < MAX_BLOCKS) {
        const strippedContent = await stripHtml(liMatch[1]);
        
        if (strippedContent.trim()) {
          blocks.push({
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [{ type: "text", text: { content: strippedContent.trim().substring(0, 2000) } }]
            }
          });
        }
      }
    } else if (tagName === 'ol') {
      // Es una lista ordenada
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      
      while ((liMatch = liRegex.exec(content)) !== null && blocks.length < MAX_BLOCKS) {
        const strippedContent = await stripHtml(liMatch[1]);
        
        if (strippedContent.trim()) {
          blocks.push({
            type: "numbered_list_item",
            numbered_list_item: {
              rich_text: [{ type: "text", text: { content: strippedContent.trim().substring(0, 2000) } }]
            }
          });
        }
      }
    } else if (tagName === 'blockquote') {
      // Es una cita
      const strippedContent = await stripHtml(content);
      
      if (strippedContent.trim()) {
        blocks.push({
          type: "quote",
          quote: {
            rich_text: [{ type: "text", text: { content: strippedContent.trim().substring(0, 2000) } }]
          }
        });
      }
    } else if (tagName === 'div') {
      // Para divs, procesamos recursivamente
      const subBlockRegex = /<(h[1-6]|p|ul|ol|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
      let subBlockMatch;
      
      // Si no hay sub-elementos, tratarlo como párrafo
      if (!subBlockRegex.test(content)) {
        const strippedContent = await stripHtml(content);
        
        if (strippedContent.trim()) {
          // Dividir en chunks si es necesario
          const chunks = splitTextIntoChunks(strippedContent.trim(), 2000);
          
          for (const chunk of chunks) {
            if (blocks.length < MAX_BLOCKS) {
              blocks.push({
                type: "paragraph",
                paragraph: {
                  rich_text: [{ type: "text", text: { content: chunk } }]
                }
              });
            }
          }
        }
      }
    }
  }
  
  // Si no encontramos suficientes bloques con el regex, intentar extraer texto plano
  if (blocks.length < 5) {
    const strippedPlainText = await stripHtml(cleanHtml);
    const plainText = strippedPlainText.trim();
    
    if (plainText) {
      const chunks = splitTextIntoChunks(plainText, 2000);
      
      chunks.forEach((chunk, index) => {
        if (blocks.length < MAX_BLOCKS && index < 10) { // Limitamos a 10 párrafos máximo
          blocks.push({
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", text: { content: chunk } }]
            }
          });
        }
      });
    }
  }
  
  // Añadir un bloque de "continuación" si el contenido fue truncado
  if (blocks.length >= MAX_BLOCKS) {
    blocks.push({
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: "... Contenido truncado por limitaciones de la API ..." } }]
      }
    });
  }
  
  return blocks;
}

/**
 * Divide un texto en chunks más pequeños
 */
function splitTextIntoChunks(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  
  if (text.length <= maxLength) {
    chunks.push(text);
    return chunks;
  }
  
  // Intentamos dividir por frases o espacios en blanco
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    } else {
      // Si la oración es demasiado larga, la dividimos por espacios
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      
      if (sentence.length <= maxLength) {
        currentChunk = sentence;
      } else {
        // Dividir por palabras
        const words = sentence.split(/\s+/);
        currentChunk = '';
        
        for (const word of words) {
          if ((currentChunk + ' ' + word).length <= maxLength) {
            currentChunk += (currentChunk ? ' ' : '') + word;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk);
            }
            
            // Si la palabra es más larga que maxLength, la dividimos
            if (word.length > maxLength) {
              for (let i = 0; i < word.length; i += maxLength) {
                chunks.push(word.substring(i, i + maxLength));
              }
              currentChunk = '';
            } else {
              currentChunk = word;
            }
          }
        }
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

/**
 * Elimina todas las etiquetas HTML del texto
 */
export async function stripHtml(html: string): Promise<string> {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
} 