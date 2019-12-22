import MongoPool from '../database/mongoClient';

exports.getAll = function getAll() {
  const db = MongoPool.getInstance();
  return db.collection('drink').find().toArray();
};