

const options = {
    swaggerDefinition: {
        info: {
        title: 'ANJAZHA API',
        version: '1.0.0',
        description: 'Anjazha API documentation',
        },

        basePath: '/api/v1',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            },

        },
    },
    apis: ['./src/routes/*.ts'],
    };


export default options;
