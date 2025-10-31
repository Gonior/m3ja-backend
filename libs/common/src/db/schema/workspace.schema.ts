import { pgTable, integer, varchar, text } from 'drizzle-orm/pg-core';
import { timestamps } from '@app/shared';
import userTable from './user.schema';
import { uniqueIndex } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { customType } from 'drizzle-orm/pg-core';

const citext = customType<{ data: string }>({
  dataType() {
    return 'citext';
  },
});

const workspaceTable = pgTable(
  'workspaces',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    ownerId: integer('owner_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    name: citext('name').notNull(),
    slug: citext('slug').notNull(),
    description: text('description'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('unique_name_per_user').on(table.ownerId, table.name),
    uniqueIndex('unique_slug_per_user').on(table.ownerId, table.slug),
    index('idx_workspaces_owner').on(table.ownerId),
    sql`CHECK (length(name) <= 100)`,
    sql`CHECK (length(slug) <= 100)`,
  ],
);

export default workspaceTable;
