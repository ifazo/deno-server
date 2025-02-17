import { MongoClient } from "npm:mongodb@6.13.0";
import { load } from "@std/dotenv";

await load({ export: true });

const MONGODB_URI = Deno.env.get("MONGODB_URI");
const DB_NAME = Deno.env.get("DB_NAME");

const client = new MongoClient(MONGODB_URI);

try {
  await client.connect();
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}

const db = client.db(DB_NAME);

const users = db.collection("users");
const categories = db.collection("categories");
const products = db.collection("products");

export { db, users, products, categories };
