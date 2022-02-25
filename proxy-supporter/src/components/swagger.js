import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

// Swagger API doc setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'openHAB Multiuser Logic Server',
    description: 'Providing logic to filter responses from the backend and to authorize requests.',
    version: '1.0.0',
    license: {
      name: 'GNU GPL-3.0',
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    },
    contact: {
      name: '@florian-h05',
      url: 'https://github.com/florian-h05/openhab-multiuser-proxy'
    }
  },
  servers: [
    {
      url: '/'
    }
  ]
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/**/routes.js'] // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);

export default (app) => app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
