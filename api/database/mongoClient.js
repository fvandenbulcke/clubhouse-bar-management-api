const { MongoClient } = require('mongodb');

let mongoDbClient;

const db = {
  user: 'achvb',
  pwd: 'achvb',
  url: 'localhost:27017',
  table: 'clubhouse',
};
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

function MongoPool() { }

function initPool() {
  let url = `mongodb://${db.user}:${db.pwd}@${db.url}/${db.table}?authSource=admin`;
  url = 'mongodb://achvb:achvb@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256&3t.uriVersion=3&3t.connection.name=clubhouse';
  MongoClient.connect(url, options, (err, connection) => {
    if (err) throw err;
    console.log('Database connection has succeed');
    mongoDbClient = connection.db('clubhouse');
  });
  return MongoPool;
}


function getInstance() {
  return mongoDbClient;
}

MongoPool.initPool = initPool;
MongoPool.getInstance = getInstance;

module.exports = MongoPool;
