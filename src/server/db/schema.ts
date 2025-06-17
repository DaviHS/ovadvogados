import {
  pgTableCreator,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => {return name;});

export const users = createTable("users", (d) => ({
  userId: d.serial("user_id").primaryKey(),
  fullName: d.varchar("full_name", { length: 100 }).notNull(),
  email: d.varchar("email", { length: 100 }),
  status: d.smallint().default(1),
  passwordHash: d.varchar("password_hash", { length: 100 }).notNull(),
  passwordCreatedAt: d.timestamp("password_created_at", { mode: "date", withTimezone: true }),
  passwordUpdatedAt: d.timestamp("password_updated_at", { mode: "date", withTimezone: true }),
  enrollmentNumber: d.varchar("enrollment_number", { length: 20 }),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow(),
}))

export const companies = createTable("companies", (d) => ({
  companyId: d.serial("company_id").primaryKey(),
  companyName: d.varchar("company_name", { length: 100 }).notNull(),
  cnpj: d.varchar("cnpj", { length: 18 }).unique(),
  email: d.varchar("email", { length: 100 }), 
  phone: d.varchar("phone", { length: 20 }),
  address: d.text("address"),
  city: d.varchar("city", { length: 50 }),
  state: d.varchar("state", { length: 2 }),
  zipCode: d.varchar("zip_code", { length: 10 }),
  status: d.smallint().default(1), 
  companyType: d.varchar("company_type", { length: 50 }),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow(),
}))

export const userCompanies = createTable("user_companies", (d) => ({
  id: d.serial("id").primaryKey(),
  userId: d
    .integer("user_id")
    .references(() => users.userId)
    .notNull(),
  companyId: d
    .integer("company_id")
    .references(() => companies.companyId)
    .notNull(),
  role: d.varchar("role", { length: 50 }).notNull(),
  status: d.smallint().default(1),
  startDate: d.timestamp("start_date", { mode: "string" }).defaultNow(),
  endDate: d.timestamp("end_date", { mode: "string" }),
  createdAt: d.timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { mode: "string" }).defaultNow(),
}))
