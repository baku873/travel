import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let clientPromise: Promise<MongoClient>;

if (!uri) {
  // Instead of throwing at the top level, we return a rejected promise.
  // This allows the build to proceed if this module is imported but not used,
  // or if the environment variables are missing during a specific build phase.
  clientPromise = Promise.reject(new Error('Invalid/Missing environment variable: "MONGODB_URI"'));
} else {
  // Use a global variable to cache the clientPromise across module reloads
  // in BOTH development and production. In Next.js serverless environments,
  // modules can be re-evaluated on each request; caching on globalThis
  // prevents unbounded connection growth.
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;