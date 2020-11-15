import express from 'express';
import drinkService from './drinkService.js';

const drinkRoutes = express.Router();

// define the home page route
drinkRoutes.get('/', function(req, res) {
  return drinkService.getAll()
    .then((results) => {
      res.send(results);
    });
});

export { drinkRoutes }