import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import MongoPool from '../database/mongoClient';

const defaultPassword = 'achvb';

function transformPlayer(player) {
  const transformedPlayer = {
    ...player,
    password: player.password !== defaultPassword,
  };
  return transformedPlayer;
}

exports.getAll = function getAll() {
  const db = MongoPool.getInstance();
  return db.collection('players').find({})
    .toArray().then((players) => players.map(transformPlayer));
};

exports.getById = function getById(playerId) {
  const db = MongoPool.getInstance();
  return db.collection('players')
    .findOne({ _id: new ObjectId(playerId) })
    .then(transformPlayer);
};

exports.create = function create(player) {
  const db = MongoPool.getInstance();
  return db.collection('players').insert(player);
};

const updateHashedPassword = (playerId, hash) => {
  MongoPool.getInstance().collection('players').updateOne(
    { _id: new ObjectId(playerId) },
    { $set: { password: hash } },
  );
};

exports.updatePassword = function updatePassword(playerId, password) {
  return bcrypt.hash(password, 10, updateHashedPassword(playerId))
    .then((hash) => updateHashedPassword(playerId, hash))
    .then(() => this.getById(playerId));
};

exports.updateBill = function updateBill(playerId, billUpdate) {
  const db = MongoPool.getInstance();

  const aggregateOperations = [];
  // loop over the drinks to add
  billUpdate.forEach(bu => {
    const attributeName = `bill.${bu.drinkId}`;
    const attributeNameField = `$bill.${bu.drinkId}`;
  
    // Check if drink already exists in bill
    // If not, create it and set quantity to 0
    const initValueIfNotExist = {};
    initValueIfNotExist[attributeName] = {
      $ifNull: [attributeNameField, Number(0)],
    };
    aggregateOperations.push({ $addFields: initValueIfNotExist });
    
    // Add quantity to drink in bill
    const updateValue = {};
    updateValue[attributeName] = {
      $add: [attributeNameField, Number(bu.quantity)],
    };
    aggregateOperations.push({ $set: updateValue });
  });

  return db.collection('players').updateOne(
    { _id: new ObjectId(playerId) },
    aggregateOperations,
  ).then(() => this.getById(playerId));
};

exports.deleteBill = function deleteBill(playerId) {
  const db = MongoPool.getInstance();
  return db.collection('players').updateOne(
    { _id: new ObjectId(playerId) },
    { $unset: { bill: null } },
  ).then(() => this.getById(playerId));
};
