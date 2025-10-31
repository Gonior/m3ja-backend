import { workspaceMembersTable } from '@app/common';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type TMember = InferSelectModel<typeof workspaceMembersTable>;
export type TNewMember = InferInsertModel<typeof workspaceMembersTable>;
