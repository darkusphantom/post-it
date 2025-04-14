import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/interfaces/post.interface';
import { WordPressService } from 'src/app/services/word-press.service';
import { OpenAIService } from 'src/app/services/open-ai.service';
import { FormControl } from '@angular/forms';
import { NotionService } from 'src/app/services/notion.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post: Post | null = null;
  aiResponse: FormControl = new FormControl('Ingrese un copy');
  isLoading = true;
  isLoadingContent = true;
  errorMessage: string | null = null;
  showCard = false;
  isSendingPost = false
  postSended = false

  constructor(
    private route: ActivatedRoute,
    private wordpress: WordPressService,
    private openAIService: OpenAIService,
    private notion: NotionService
  ) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.wordpress.getPostById(postId)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            setTimeout(() => {
              this.isLoadingContent = false;
            }, 500);
          })
        )
        .subscribe({
          next: (post: any) => {
            this.post = post;
            if (this.post?.content.rendered) {
              this.sanitizeContent();
            }
          },
          error: (error: any) => {
            this.handleError(error);
          }
        });
    }
  }

  prepareToPublish(): void {
    if (this.post?.content?.rendered) {
      const content = this.stripHtml(this.post.content.rendered);
      this.openAIService.getResponse(content).subscribe({
        next: (response) => {
          if (response) {
            this.aiResponse.setValue(response);
            this.showCard = true;
          } else {
            this.aiResponse.setValue('Aca iba algo XD (No se pudo obtener una respuesta)');
            console.log('No se pudo obtener una respuesta.');
          }
        },
        error: (error: Error) => {
          console.error('Error AI:', error);
          this.errorMessage = `Error al consultar la IA: ${error.message}`;
          this.showToast(this.errorMessage);
        }
      });
    }
  }

  sendPost(): void {
    this.isSendingPost = true
    if (this.post && this.aiResponse.value) {
      // Convertir el contenido HTML en bloques de Notion
      const contentBlocks = this.convertHtmlToNotionBlocks(this.post.content.rendered);

      // Crear los bloques para la respuesta de la IA
      const aiBlocks = [
        {
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "Contenido para Redes Sociales" } }]
          }
        },
        {
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: this.aiResponse.value } }]
          }
        }
      ];

      const pageData = {
        icon: '👨‍💻',
        title: this.post.title.rendered,
        socialNetworks: [
          { name: "Linkedin", color: "brown" },
          { name: "Facebook", color: "default" }
        ],
        url: this.post.link,
        state: "Completo",
        published: false,
        topics: [
          { name: "👨‍💻 Programación", color: "blue" }
        ],
        children: [
          {
            type: "heading_2",
            heading_2: {
              rich_text: [{ type: "text", text: { content: "Contenido Original" } }]
            }
          },
          ...contentBlocks,
          ...aiBlocks
        ]
      };

      this.notion.createPage(pageData).subscribe({
        next: (_response: any) => {
          this.isSendingPost = false
          this.postSended = true
        },
        error: (error: any) => {
          this.isSendingPost = false
          console.error('Error al crear la página:', error);
          window.alert(`Error al crear la página: ${error.message}`)
        }
      });
    }
  }

  private handleError(error: any): void {
    console.error('Error fetching post:', error);
    this.errorMessage = error.error?.details as string || 'Error desconocido al cargar el post';
    this.showToast(this.errorMessage);
  }

  private showToast(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800';
    toast.innerHTML = `
      <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
        <span class="sr-only">Error icon</span>
      </div>
      <div class="ms-3 text-sm font-normal">${message}</div>
      <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  private sanitizeContent(): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.post!.content.rendered, 'text/html');

    // Procesar todos los enlaces
    doc.querySelectorAll('a').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    // Procesar imágenes
    doc.querySelectorAll('img').forEach(img => {
      img.classList.add('rounded-lg', 'shadow-md');
      img.setAttribute('loading', 'lazy');
    });

    // Procesar bloques de código
    doc.querySelectorAll('pre').forEach(pre => {
      pre.classList.add('rounded-lg', 'p-4', 'overflow-x-auto');
    });

    this.post!.content.rendered = doc.body.innerHTML;
  }

  private convertHtmlToNotionBlocks(html: string): any[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks: any[] = [];
    const MAX_BLOCKS = 95; // Dejamos espacio para los bloques de título y AI response

    const processNode = (node: Node) => {
      if (blocks.length >= MAX_BLOCKS) return null; // Detener si alcanzamos el límite
      if (node.nodeType === Node.TEXT_NODE) {
        return null;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const textContent = element.textContent?.trim();

        if (!textContent) return null;

        // Dividir el contenido en chunks de 2000 caracteres
        const chunks = textContent.match(/.{1,2000}/g) || [textContent];

        switch (element.tagName.toLowerCase()) {
          case 'h1':
            return chunks.map(chunk => ({
              type: "heading_1",
              heading_1: {
                rich_text: [{ type: "text", text: { content: chunk } }]
              }
            }));
          case 'h2':
            return chunks.map(chunk => ({
              type: "heading_2",
              heading_2: {
                rich_text: [{ type: "text", text: { content: chunk } }]
              }
            }));
          case 'p':
            return chunks.map(chunk => ({
              type: "paragraph",
              paragraph: {
                rich_text: [{ type: "text", text: { content: chunk } }]
              }
            }));
          case 'ul':
            return Array.from(element.children).map(li => ({
              type: "bulleted_list_item",
              bulleted_list_item: {
                rich_text: [{ type: "text", text: { content: li.textContent?.trim() || '' } }]
              }
            }));
          case 'ol':
            return Array.from(element.children).map(li => ({
              type: "numbered_list_item",
              numbered_list_item: {
                rich_text: [{ type: "text", text: { content: li.textContent?.trim() || '' } }]
              }
            }));
          default:
            return chunks.map(chunk => ({
              type: "paragraph",
              paragraph: {
                rich_text: [{ type: "text", text: { content: chunk } }]
              }
            }));
        }
      }
      return null;
    };

    // Procesar cada elemento del body hasta alcanzar el límite
    for (const element of Array.from(doc.body.children)) {
      if (blocks.length >= MAX_BLOCKS) break;

      const processedBlocks = processNode(element);
      if (processedBlocks && Array.isArray(processedBlocks)) {
        // Añadir bloques hasta alcanzar el límite
        const remainingSpace = MAX_BLOCKS - blocks.length;
        blocks.push(...processedBlocks.slice(0, remainingSpace));
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
  private stripHtml(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}
