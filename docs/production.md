## Configuración para Producción

1. **Construir la Aplicación**:

   ```bash
   pnpm build
   ```

   o puedes utilizar npm

   ```bash
   npm run build
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
  app.use(
    cors({
      origin: "https://tu-dominio.netlify.app", // Cambia esto por tu dominio de Netlify
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
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