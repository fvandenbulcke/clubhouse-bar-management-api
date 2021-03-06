import mongodb from 'mongodb';
import bcrypt from 'bcryptjs';
import drinkService from '../drink/drinkService.js';
import MongoPool from '../database/mongoClient.cjs';

const { ObjectId } = mongodb;

const defaultPassword = 'achvb';

function transformPlayer(player) {
  if (!player) return null;
  const transformedPlayer = {
    ...player,
    password: player.password !== defaultPassword,
  };
  return transformedPlayer;
}

const updateHashedPassword = (playerId, hash) => {
  MongoPool.getInstance().collection('players').updateOne(
    { _id: new ObjectId(playerId) },
    { $set: { password: hash } },
  );
};

export default {
  getAll() {
    const db = MongoPool.getInstance();
    return db.collection('players').find({})
      .toArray().then((players) => players.map(transformPlayer));
  },
  
  getById(playerId) {
    const db = MongoPool.getInstance();
    return db.collection('players')
      .findOne({ _id: new ObjectId(playerId) })
      .then(transformPlayer);
  },
  
  create(player) {
    const db = MongoPool.getInstance();
    return db.collection('players').insert(player);
  },
  
  updatePassword(playerId, password) {
    return bcrypt.hash(password, 10, updateHashedPassword(playerId))
      .then((hash) => updateHashedPassword(playerId, hash))
      .then(() => this.getById(playerId));
  },
  
  updateBill(playerId, billUpdate) {
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
  },
  
  deleteBill(playerId) {
    const db = MongoPool.getInstance();
    return db.collection('players').updateOne(
      { _id: new ObjectId(playerId) },
      { $unset: { bill: null } },
    ).then(() => this.getById(playerId));
  },
  
  getBill(playerId) {
    return Promise.all([
      drinkService.getAll(),
      this.getById(playerId),
    ]).then((values) => {
      const allDrinks = values[0];
      const player = values[1];
      
      Object.keys(player.bill).forEach((billDate) => {
        let label = '';
        let amount = 0;
        console.log(billDate);
        Object.keys(player.bill[billDate]).forEach((drinkId) => {
          console.log(drinkId);
          const currentDrink = allDrinks.find((d) => d.id.toString() === drinkId.toString());
          label += `${player.bill[billDate][drinkId]} ${currentDrink.label}, `;
          amount += player.bill[billDate][drinkId] * currentDrink.price;
        });
        player.bill[billDate] = { label, amount };
      });
      return player;
    });
  }
}