import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    firstname: varchar('first_name',{ length: 55 }).notNull(),
    lastname: varchar('last_name', { length: 55 }),
    email: text({ length: 255 }).notNull().unique(),
    password: text({ length: 255 }).notNull(),
    salt: text({ length: 255 }).notNull(),
})