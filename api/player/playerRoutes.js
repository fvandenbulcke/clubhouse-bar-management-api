import express from 'express';
import playerService from './playerService.js';

const playerRoutes = express.Router();

playerRoutes.get('/', function(req, res) {
  return playerService.getAll()
    .then((result) => {
      res.send(result);
    });
});

playerRoutes.post('/_create', function(req, res) {
  return playerService.create(req.body)
    .then((result) => {
      res.send(result);
    });
});

playerRoutes.get('/:player', function(req, res) {
  const playerId = req.params.player;
  return playerService.getById(playerId)
    .then((result) => {
      res.send(result);
    });
});

playerRoutes.get('/:player/bill', function(req, res) {
  const playerId = req.params.player;
  return playerService.getBill(playerId)
    .then((result) => {
      res.send(result);
    });
});

playerRoutes.post('/:player/bill', function(req, res) {
  const playerId = req.params.player;
  const { body } = req;
  return playerService.updateBill(playerId, body)
    .then((result) => {
      res.send(result);
    });
});

playerRoutes.put('/:player/password', function(req, res) {
  const playerId = req.params.player;
  const { password } = req.body;
  return playerService.updatePassword(playerId, password)
    .then((result) => {
      res.send(result);
    });
});

playerRoutes.delete('/:player/drinks', function(req, res) {
  const playerId = req.params.player;
  return playerService.deleteBill(playerId)
    .then((result) => {
      res.send(result);
    });
});

export { playerRoutes }