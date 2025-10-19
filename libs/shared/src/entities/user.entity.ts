import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { userTable } from "../../../common/src/db/schema"
export type TUser = InferSelectModel<typeof userTable>
export type TNewUser = InferInsertModel<typeof userTable>