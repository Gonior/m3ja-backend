import dotenvFlow from 'dotenv-flow';
import { defineConfig } from 'drizzle-kit';
import dotenvExpand from 'dotenv-expand';
dotenvExpand.expand(dotenvFlow.config());

export default defineConfig({
  schema: 'libs/common/src/db/schema/**/*.ts',
  out: 'drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL as string,
  },
});
