import playerService from '../services/playerService';

exports.getById = function getById(req, res) {
  const playerId = req.swagger.params.player.value;
  return playerService.getById(playerId)
    .then((result) => {
      res.send(result);
    });
};

exports.create = function create(req, res) {
  return playerService.create(req.body)
    .then((result) => {
      res.send(result);
    });
};

exports.updatePassword = function updatePassword(req, res) {
  const playerId = req.swagger.params.player.value;
  const { password } = req.body;
  return playerService.updatePassword(playerId, password)
    .then((result) => {
      res.send(result);
    });
};

exports.updateBill = function updateBill(req, res) {
  const playerId = req.swagger.params.player.value;
  const { body } = req;
  return playerService.updateBill(playerId, body)
    .then((result) => {
      res.send(result);
    });
};

exports.deleteBill = function deleteBill(req, res) {
  const playerId = req.swagger.params.player.value;
  return playerService.deleteBill(playerId)
    .then((result) => {
      res.send(result);
    });
};
