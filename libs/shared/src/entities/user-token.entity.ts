import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { userTokensTable } from '@app/common';
export type TNewUserToken = InferInsertModel<typeof userTokensTable>;
export type TUserToken = InferSelectModel<typeof userTokensTable>;
