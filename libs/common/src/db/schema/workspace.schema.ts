import { pgTable, integer, varchar, text } from 'drizzle-orm/pg-core';
import { timestamps } from '@app/shared';
import userTable from './user.schema';
import { uniqueIndex } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const workspaceTable = pgTable(
  'workspaces',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    ownerId: integer('owner_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    ...timestamps,
  },
  (table) => ({
    uniqueNamePerUser: uniqueIndex('unique_name_per_user').on(table.ownerId, table.name),
    uniqueSlugPerUser: uniqueIndex('unique_slug_per_user').on(table.ownerId, table.slug),
    ownerIndex: index('idx_workspaces_owner').on(table.ownerId),
    nameLengthCheck: sql`CHECK (length(name) <= 100)`,
    slugLengthCheck: sql`CHECK (length(slug) <= 100)`,
  }),
);

export default workspaceTable;
