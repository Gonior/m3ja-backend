import dotenfFlow from 'dotenv-flow'
import { defineConfig} from 'drizzle-kit'
import dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenfFlow.config())

export default defineConfig({
    schema : process.env.DRIZZLE_SCHEMA_DIR,
    out : process.env.DRIZZLE_MIGRATION_FOLDER,
    dialect : 'postgresql',
    dbCredentials : {
        url : process.env.DRIZZLE_DATABASE_URL as string
    }
})