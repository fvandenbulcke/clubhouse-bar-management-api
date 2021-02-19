import MongoPool from '../database/mongoClient.cjs';

const drinksCollection = () => MongoPool.getInstance().collection('drink');

export default {
  getAll() {
    return drinksCollection().find().toArray()
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
  },
  add(drink) {
    return drinksCollection().insert(drink)
      .then(({ops}) => ops);
  },
}