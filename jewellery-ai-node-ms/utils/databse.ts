import { MongoClient, Db } from "mongodb";

const MONGO_DB_URL =
  process.env.JEWELLERY_MONGO_DB_URL ||
  "mongodb+srv://appuser:AppUser01@cluster0.r3yoijy.mongodb.net/jewellery-db";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGO_DB_URL);
    await client.connect();
    const dbName =
      new URL(MONGO_DB_URL).pathname.slice(1).split("?")[0] || "jewellery-db";
    db = client.db(dbName);
    console.log("Successfully connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("Disconnected from MongoDB");
  }
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase();
  }
  return Promise.resolve(db);
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectFromDatabase();
  process.exit(0);
});
