import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function connectWithRetry(maxRetries = 5, retryDelay = 5000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempting to connect to database (attempt ${i + 1}/${maxRetries})...`);
      const client = postgres(process.env.DATABASE_URL!, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
      });
      await client`SELECT 1`; // Test the connection
      console.log('Successfully connected to database');
      return client;
    } catch (error) {
      console.error(`Failed to connect to database (attempt ${i + 1}/${maxRetries}):`, error);
      if (i < maxRetries - 1) {
        console.log(`Retrying in ${retryDelay/1000} seconds...`);
        await sleep(retryDelay);
      }
    }
  }
  throw new Error('Failed to connect to database after multiple attempts');
}

export const client = await connectWithRetry();
export const db = drizzle(client, { schema });