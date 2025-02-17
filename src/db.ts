import { MongoClient } from "npm:mongodb@6.13.0";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();

const MONGODB_URI = env.MONGODB_URI;
const DB_NAME = env.DB_NAME;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  Deno.exit(1);
}

const client = new MongoClient(MONGODB_URI);

try {
  await client.connect();
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  Deno.exit(1);
}

const db = client.db(DB_NAME);

const products = db.collection("products");
const categories = db.collection("categories");

export { db, products, categories };