import { text, timestamp } from 'drizzle-orm/pg-core';
import { integer, pgTable } from 'drizzle-orm/pg-core';
import userTable from './user.schema';
import { uuid } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
const userTokensTable = pgTable(
  'user_tokens',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    jti: uuid('jti').notNull().unique(),
    token: text('token').notNull(),
    userAgent: text('user_agent'),
    ipAddress: text('ip_address'),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [index('jti_idx').on(table.jti)],
);
export default userTokensTable;
