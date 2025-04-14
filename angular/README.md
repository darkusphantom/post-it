# Post It!

## Descripción del Proyecto

**PostIt** es una aplicación web diseñada para gestionar y publicar contenido en redes sociales. Permite a los usuarios crear, editar y publicar posts, integrando la inteligencia artificial de OpenAI para generar contenido atractivo y relevante. Además, la aplicación se conecta a Notion para almacenar y organizar los posts de manera eficiente.

## Herramientas Utilizadas

- **Angular**: Framework para construir la interfaz de usuario.
- **TypeScript**: Lenguaje de programación utilizado para el desarrollo.
- **OpenAI API**: Para generar contenido automáticamente.
- **Notion API**: Para almacenar y gestionar los posts.
- **Tailwind CSS**: Para el diseño y estilos de la aplicación.
- **RxJS**: Para manejar la programación reactiva y las solicitudes HTTP.
- **Netlify**: Para el despliegue de la aplicación frontend.

## Configuración del Proyecto

### Requisitos Previos

- Node.js (versión 14 o superior)
- Angular CLI (versión 16.2.16 o superior)

### Configuración para Desarrollo

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/postit.git
   cd postit
   ```

2. **Instalar Dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**:
   Crea un archivo `.env` en la raíz del proyecto y añade tus claves API:
   ```plaintext
   CHATGPT_API_KEY=tu_clave_de_openai
   API_KEY_NOTION=tu_clave_de_notion
   ```

4. **Iniciar el Servidor de Desarrollo**:
   ```bash
   ng serve
   ```
   Navega a `http://localhost:4200/` para ver la aplicación en acción. La aplicación se recargará automáticamente si realizas cambios en los archivos de origen.

### Configuración para Producción

1. **Construir la Aplicación**:
   ```bash
   ng build --prod
   ```
   Los artefactos de construcción se almacenarán en el directorio `dist/`.

2. **Desplegar en Netlify**:
   - Crea una cuenta en [Netlify](https://www.netlify.com/).
   - Conecta tu repositorio de GitHub a Netlify.
   - Configura el comando de construcción como `ng build --prod` y el directorio de publicación como `dist/postit`.
   - Despliega la aplicación.

### Manejo de CORS en Producción

Para evitar problemas de CORS en producción:
- Asegúrate de que tu backend (Node.js) esté configurado para permitir solicitudes desde el dominio de tu aplicación desplegada en Netlify.
- En el backend, configura CORS para permitir el origen de tu aplicación:
  ```javascript
  app.use(cors({
    origin: 'https://tu-dominio.netlify.app', // Cambia esto por tu dominio de Netlify
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  ```

## Flujo de Uso de la Aplicación

1. **Navegación**:
   - Al abrir la aplicación, los usuarios son recibidos en el **Dashboard**, donde pueden ver una lista de posts.
   - Cada post tiene un enlace que lleva a la vista detallada del post.

2. **Creación de Posts**:
   - En la vista del post, los usuarios pueden ver el contenido y la fecha de creación.
   - Al hacer clic en "Publicar", se abre un modal donde se puede preparar el contenido para su publicación.

3. **Generación de Contenido**:
   - La aplicación utiliza la API de OpenAI para generar contenido adicional basado en el contenido existente.
   - Si la consulta a la IA falla, se muestra un mensaje de error y se permite al usuario editar el contenido manualmente.

4. **Publicación**:
   - Una vez que el contenido está listo, se puede enviar a Notion para su almacenamiento y gestión.

5. **Manejo de Errores**:
   - La aplicación maneja errores de manera efectiva, mostrando mensajes claros en caso de fallos en la carga de datos o en la generación de contenido.

## Contribuciones

Si deseas contribuir a este proyecto, por favor abre un issue o envía un pull request. ¡Todas las contribuciones son bienvenidas!

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo LICENSE.
