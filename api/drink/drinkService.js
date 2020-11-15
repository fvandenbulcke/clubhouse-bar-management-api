import MongoPool from '../database/mongoClient.cjs';

export default {
  getAll() {
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
  }
}