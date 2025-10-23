import dotenvFlow from 'dotenv-flow';
import { defineConfig } from 'drizzle-kit';
import dotenvExpand from 'dotenv-expand';
dotenvExpand.expand(dotenvFlow.config());

export default defineConfig({
  schema: process.env.DRIZZLE_SCHEMA_DIR,
  out: process.env.DRIZZLE_MIGRATION_FOLDER,
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL as string,
  },
});
