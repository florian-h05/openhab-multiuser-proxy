import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import fetch from 'node-fetch';
import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

dotenv.config();

// Server variables.
const PORT = (process.env.PORT !== undefined) ? parseInt(process.env.PORT) : 3001;
const backend = {
  HOST: (process.env.HOST !== undefined) ? process.env.HOST : 'http://127.0.0.1:8080'
};
const app = express();

// Swagger API doc setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'openHAB Multiuser Logic Server',
    description: "Providing logic to filter responses from the backend and to authorize requests.",
    version: '1.0.0',
    license: {
      name: 'GNU GPL-3.0',
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html',
    },
    contact: {
      name: '@florian-h05',
      url: 'https://github.com/florian-h05/openhab-multiuser-proxy'
    }
  },
  servers: [
    {
      url: `http://localhost:${PORT}`
    }
  ]
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js'] // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Server setup.
app.use(helmet());
app.use(express.json());

// Use routes.
import routes from './routes/routes.js';
routes(app, fetch, backend);

// Server activation.
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
