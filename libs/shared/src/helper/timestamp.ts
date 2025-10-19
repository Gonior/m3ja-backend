import { timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const timestamps = {
  createdAt: timestamp('created_at')
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`now()`)
    .$onUpdateFn(() => sql`now()`)
    .notNull(),
};
