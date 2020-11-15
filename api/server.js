import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import MongoPool from './database/mongoClient.cjs';
import { drinkRoutes } from './drink/drinkRoutes.js';
import { playerRoutes } from './player/playerRoutes.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/clubhouse/drink', drinkRoutes);
app.use('/clubhouse/player', playerRoutes);

// Constants
const PORT = 8090;
const HOST = '0.0.0.0';

const swaggerDescription = YAML.load('./api/swagger/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDescription));

// Initilisation de la connection à la bdd
MongoPool.initPool()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}!`);
    });
  });