import drinkService from '../services/drinkService';

exports.getAll = function getAll(req, res) {
  return drinkService.getAll()
    .then((results) => {
      res.send(results);
    });
};