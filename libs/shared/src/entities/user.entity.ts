import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { userTable } from '@app/common';
export type TUser = InferSelectModel<typeof userTable>;
export type TNewUser = InferInsertModel<typeof userTable>;
