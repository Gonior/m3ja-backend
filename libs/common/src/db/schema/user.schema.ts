import { text, pgTable, varchar, integer } from "drizzle-orm/pg-core";
import {timestamps} from '@app/shared'

const userTable = pgTable('users', {
  id : integer('id').primaryKey().generatedAlwaysAsIdentity(),
  displayName : varchar('display_name',{length : 100 }).notNull(),
  email : varchar('email',{length:255}).notNull().unique(),
  password: text('password').notNull(),
  profilePictureUrl : text('profile_picture_url'),
  ...timestamps
})

export default userTable