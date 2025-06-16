import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 20 }),
  passwordHash: varchar("password_hash", { length: 100 }).notNull(),
  passwordCreatedAt: timestamp("password_created_at", { mode: "string" }),
  passwordUpdatedAt: timestamp("password_updated_at", { mode: "string" }),
  enrollmentNumber: varchar("enrollment_number", { length: 20 }).unique(),
});
