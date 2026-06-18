import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:[YOUR-PASSWORD]@db.qxfsacjvwxltkrrqsbjm.supabase.co:5432/postgres";

// prepare: false is required for connection pooling in serverless environments (PgBouncer/Supabase Pooler)
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
