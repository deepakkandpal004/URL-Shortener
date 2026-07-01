import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
    id:        uuid().primaryKey().defaultRandom(),
    firstname: varchar('first_name', { length: 55 }).notNull(),
    lastname:  varchar('last_name',  { length: 55 }),
    email:     text().notNull().unique(),
    password:  text().notNull(),
    salt:      text().notNull(),
})
