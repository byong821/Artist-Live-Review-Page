import { MongoClient } from 'mongodb';

let db;

export async function connectDB() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB');
}

export function getDB() {
  return db;
}
