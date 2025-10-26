import { text, pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { timestamps } from '@app/shared';
import { index } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';

export const avatarResizeStatusEnum = pgEnum('avatarResizeStatusEnum', [
  'none',
  'processing',
  'done',
  'failed',
]);

// keterangan
// none : tanpa avatar
// processing : sedang diproses
// done : avatar sudah di-resize
// fail : avatar gagal di resize

const userTable = pgTable(
  'users',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    displayName: varchar('display_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    avatarKey: text('avatar_key'),
    avatarResizeStatus: avatarResizeStatusEnum('avatar_resize_status').default('none'),
    ...timestamps,
  },
  (table) => [index('email_idx').on(table.email)],
);

export default userTable;
