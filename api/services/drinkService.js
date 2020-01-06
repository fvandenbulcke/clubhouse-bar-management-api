import MongoPool from '../database/mongoClient';

exports.getAll = function getAll() {
  const db = MongoPool.getInstance();
  return db.collection('drink').find().toArray()
    .then((results) => {
      return results.map((d) => {
        const transformed = {
          ...d,
          id: d._id,
        };
        delete transformed._id;
        return transformed;
      });
    });
};
