const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'digibookedu';

let client;
let db;

async function connectDB() {
  client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  db = client.db(DB_NAME);

  await ensureIndexes();
  const { seedDatabase } = require('./seed');
  await seedDatabase({ collection, getNextId });

  console.log(`Connected to MongoDB: ${MONGODB_URI}/${DB_NAME}`);
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('MongoDB has not been initialized. Call connectDB() first.');
  }
  return db;
}

function collection(name) {
  return getDb().collection(name);
}

async function getNextId(collectionName) {
  const result = await collection('counters').findOneAndUpdate(
    { _id: collectionName },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  return result.value.seq;
}

async function ensureIndexes() {
  await collection('users').createIndex({ id: 1 }, { unique: true });
  await collection('users').createIndex({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
  await collection('courses').createIndex({ id: 1 }, { unique: true });
  await collection('modules').createIndex({ id: 1 }, { unique: true });
  await collection('progress').createIndex({ id: 1 }, { unique: true });
  await collection('progress').createIndex({ userId: 1, courseId: 1 }, { unique: true });
  await collection('blogs').createIndex({ id: 1 }, { unique: true });
  await collection('timetable').createIndex({ id: 1 }, { unique: true });
}

module.exports = {
  connectDB,
  getDb,
  collection,
  getNextId
};
