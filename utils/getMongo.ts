import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  //   @ts-ignores
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    //   @ts-ignores
    global._mongoClientPromise = client.connect();
  }
  //   @ts-ignores
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const getCollection = <Type>(collection: DbEntities) =>
  clientPromise.then((r) => r.db().collection<Type>(collection));

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.

export default clientPromise;
