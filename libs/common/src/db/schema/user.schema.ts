import { text, pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { timestamps } from '@app/shared';
import { index } from 'drizzle-orm/pg-core';

const userTable = pgTable(
  'users',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    displayName: varchar('display_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    avatarKey: text('avatar_key'),
    ...timestamps,
  },
  (table) => [index('email_idx').on(table.email)],
);

export default userTable;
