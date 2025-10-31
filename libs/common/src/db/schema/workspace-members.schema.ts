import { integer, unique, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import userTable from './user.schema';
import workspaceTable from './workspace.schema';
import { pgTable } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { uniqueIndex } from 'drizzle-orm/pg-core';

export const workspaceRoleEnum = pgEnum('workspace_role', ['owner', 'admin', 'member', 'viewer']);
export type WorkspaceRole = (typeof workspaceRoleEnum.enumValues)[number];

const workspaMembersTable = pgTable(
  'workspace_members',
  {
    id: integer('id').primaryKey().notNull().generatedAlwaysAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    workspaceId: integer('workspace_id')
      .notNull()
      .references(() => workspaceTable.id, { onDelete: 'cascade' }),
    joinAt: timestamp('join_at').notNull().defaultNow(),
    role: workspaceRoleEnum('role').notNull().default('viewer'),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  },
  (t) => [
    uniqueIndex('workspace_member_unique_idx').on(t.userId, t.workspaceId),
    uniqueIndex('workspace_owner_unique_idx')
      .on(t.workspaceId)
      .where(sql`${t.role} = 'owner`),
  ],
);

export default workspaMembersTable;
