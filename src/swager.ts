import swagerJsdoc from 'swagger-jsdoc';
import swagerOptions from './Config/swagerOption';

const swaggerSpec = swagerJsdoc(swagerOptions);

export default swaggerSpec;