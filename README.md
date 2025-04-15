# Post It!

## Descripción del Proyecto

**PostIt** es una aplicación web diseñada para gestionar y publicar contenido en redes sociales. Permite a los usuarios crear, editar y publicar posts, integrando la inteligencia artificial de OpenAI para generar contenido atractivo y relevante. Además, la aplicación se conecta a Notion para almacenar y organizar los posts de manera eficiente.

## Herramientas Utilizadas

- **NextJS**: Framework para construir la interfaz de usuario.
- **TypeScript**: Lenguaje de programación utilizado para el desarrollo.
- **OpenAI API**: Para generar contenido automáticamente.
- **Notion API**: Para almacenar y gestionar los posts.
- **Tailwind CSS**: Para el diseño y estilos de la aplicación.
- **Vercel**: Para el despliegue de la aplicación frontend.

## Configuración del Proyecto

### Requisitos Previos

- Node.js (versión 14 o superior)
- Angular CLI (versión 16.2.16 o superior)

### Configuración para Desarrollo

1. **Clonar el Repositorio**:

   ```bash
   git clone https://github.com/darkusphantom/postit.git
   cd postit
   ```

2. **Instalar Dependencias**:

   ```bash
   pnpm install
   ```

   o puedes utilizar npm

   ```bash
   pnpm install
   ```

3. **Configurar Variables de Entorno**:
   Crea un archivo `.env` en la raíz del proyecto y añade tus claves API:

   ```plaintext
   NODE_ENV=
   CHATGPT_API_KEY=tu_clave_de_openai
   NOTION_API_KEY=tu_clave_de_notion
   NOTION_DATABASE_ID=tu_id_DB_de_notion
   WORDPRESS_API_URL=tu_clave_de_wordpress
   ```

4. **Iniciar el Servidor de Desarrollo**:

   ```bash
   pnpm dev
   ```

   o puedes utilizar npm

   ```bash
   npm run dev
   ```

   Navega a `http://localhost:3000/` para ver la aplicación en acción. La aplicación se recargará automáticamente si realizas cambios en los archivos de origen.

## Contribuciones

Si deseas contribuir a este proyecto, por favor abre un issue o envía un pull request. ¡Todas las contribuciones son bienvenidas!

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo LICENSE.
