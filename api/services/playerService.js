import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import MongoPool from '../database/mongoClient';

exports.getById = function getById(playerId) {
  const db = MongoPool.getInstance();
  return db.collection('players').findOne({ _id: new ObjectId(playerId) });
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

  const attributeName = `bill.${billUpdate.drinkId}`;
  const attributeNameField = `$bill.${billUpdate.drinkId}`;

  const initValueIfNotExist = {};
  initValueIfNotExist[attributeName] = {
    $ifNull: [attributeNameField, Number(0)],
  };

  const updateValue = {};
  updateValue[attributeName] = {
    $add: [attributeNameField, Number(billUpdate.quantity)],
  };

  return db.collection('players').updateOne(
    { _id: new ObjectId(playerId) },
    [
      { $addFields: initValueIfNotExist },
      { $set: updateValue },
    ],
  ).then(() => this.getById(playerId));
};

exports.deleteBill = function deleteBill(playerId) {
  const db = MongoPool.getInstance();
  return db.collection('players').update(
    { _id: new ObjectId(playerId) },
    { $unset: { bill: null } },
  ).then(() => this.getById(playerId));
};
