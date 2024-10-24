import { pgClient, connectDB, disconnectDB } from "@/Infrastructure/database";
import { migrate } from "postgres-migrations";

async function runMigrations(): Promise<void> {
  await connectDB();
  try {
    await migrate({ client: pgClient }, "src/Infrastructure/database/migrations/");
    console.log("migration complete");
  }catch (error) {
    console.log(error)
  }
   finally {
    await disconnectDB();
  }
}

runMigrations();
