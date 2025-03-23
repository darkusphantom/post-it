const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
const serverless = require('serverless-http');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman)
    if (!origin) return callback(null, true);
    if (['http://localhost:4200', 'https://post-it-now.netlify.app'].indexOf(origin) === -1) {
      const msg = 'El origen ' + origin + ' no está permitido';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

app.options('*', cors()); // Permitir todas las opciones

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY,
});

const notion = new Client({
  auth: process.env.API_KEY_NOTION
});

app.post('/api/openai/generate', async (req, res) => {
  const { content } = req.body;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: "Comportarte como un experto en creación de contenido para redes sociales, deberás crear un copy. Escribelo en texto creativo, que conecte con el publico y despierte su curiosidad. El escrito debe ser de un maximo de 180 caracteres"
        },
        { role: 'user', content: content }
      ],
      model: 'gpt-4o-mini',
      max_tokens: 150
    });

    res.json({
      response: response.choices[0].message.content
    });
  } catch (error) {
    console.error("Error en OpenAI:", error);
    res.status(500).json({
      error: 'Error al generar el contenido con OpenAI',
      details: error.message
    });
  }
});

app.post('/api/notion/query-database', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: '09572b046a44492595b7cc4d551827ab',
      ...req.body
    });
    res.json(response);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({
      error: 'Error al consultar la base de datos de Notion',
      details: error.message,
      code: error.code
    });
  }
});

app.post('/api/notion/create-page', async (req, res) => {
  try {
    const { icon, title, socialNetworks, url, state, published, topics, children } = req.body;

    const response = await notion.pages.create({
      parent: {
        database_id: '09572b046a44492595b7cc4d551827ab'
      },
      icon: {
        type: "emoji",
        emoji: icon || ''
      },
      properties: {
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: title
              }
            }
          ]
        },
        "Social Network": {
          type: "multi_select",
          multi_select: socialNetworks
        },
        "URL": {
          type: "url",
          url: url
        },
        "State": {
          type: "select",
          select: {
            name: state || "Completo",
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
          checkbox: published || false
        },
        "Topic": {
          type: "multi_select",
          multi_select: topics || []
        }
      },
      children: children.map(block => {
        // Asegurarse de que cada bloque tenga la estructura correcta
        return {
          object: "block",
          type: block.type,
          [block.type]: {
            rich_text: block[block.type].rich_text.map(text => ({
              type: "text",
              text: {
                content: text.text.content
              }
            }))
          }
        };
      })
    });

    res.json(response);
  } catch (error) {
    console.error('Error al crear la página:', error);
    res.status(500).json({
      error: 'Error al crear la página en Notion',
      details: error.message || 'Error desconocido'
    });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Variables de entorno cargadas:', {
    OPENAI_API_KEY: process.env.CHATGPT_API_KEY ? 'Presente' : 'No presente',
    API_KEY_NOTION: process.env.API_KEY_NOTION ? 'Presente' : 'No presente'
  });
});

// Exportar el handler para Netlify Functions
module.exports.handler = serverless(app);
