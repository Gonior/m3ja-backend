import { sql } from 'drizzle-orm';

export const enableCitext = sql`CREATE EXTENSION IF NOT EXISTS citext`;
