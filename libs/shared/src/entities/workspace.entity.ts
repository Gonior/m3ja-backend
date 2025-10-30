import { workspaceTable } from '@app/common';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type TNewWorkspace = InferInsertModel<typeof workspaceTable>;
export type TWorkspace = InferSelectModel<typeof workspaceTable>;
