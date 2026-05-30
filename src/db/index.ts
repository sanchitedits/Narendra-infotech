import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema.js';

const { Pool } = pkg;

// Only initialize if DATABASE_URL is present
let db: any = null;

export const getDb = () => {
    if (db) return db;
    if (process.env.DATABASE_URL) {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        db = drizzle(pool, { schema });
        return db;
    }
    return null;
}
