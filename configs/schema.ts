// Updated Database Schema (schema.ts)
import { integer, json, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const HistoryTable = pgTable('historyTable', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  recordId: varchar({ length: 255 }).notNull(),
  content: json(),
  userEmail: varchar('userEmail', { length: 255 }).references(() => usersTable.email),
  createdAt: timestamp().defaultNow(), // Use proper timestamp instead of varchar
  aiAgentType: varchar('aiAgentType', { length: 255 }), // Add length specification
  metaData:varchar({ length: 2000 })

});