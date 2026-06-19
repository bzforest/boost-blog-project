import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Boost Blog API',
      version: '1.0.0',
      description: 'API Documentation for Boost Blog Project',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
  },
  // Path to the API docs: Scan all routing files
  apis: ['./src/modules/**/*.route.ts'],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
