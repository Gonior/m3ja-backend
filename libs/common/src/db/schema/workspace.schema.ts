import { pgTable, integer, varchar, text } from 'drizzle-orm/pg-core';
import { timestamps } from '@app/shared';
import userTable from './user.schema';

const workspaceTable = pgTable('workspaces', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }),
  description: text('description'),
  ...timestamps,
});

export default workspaceTable;
