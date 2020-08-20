import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import SwaggerExpress from 'swagger-express-mw';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import MongoPool from './database/mongoClient';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Constants
const PORT = 8090;
const HOST = '0.0.0.0';

const swaggerDescription = YAML.load('./api/swagger/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDescription));


const swaggerConfig = {
  appRoot: '.',
  swagger: 'api/swagger/swagger.yaml',
};
// swagger || swaggerFile to choose swagger.json instead of api/swagger/swagger.yaml


SwaggerExpress.create(swaggerConfig, (err, swaggerExpress) => {
  if (err) { throw err; }
  // install middleware
  swaggerExpress.register(app);
  app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
  });
});

// Initilisation de la connection à la bdd
MongoPool.initPool();

module.exports = { app };
