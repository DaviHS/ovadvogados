import { pgTable  } from "drizzle-orm/pg-core";


// USERS
export const users = pgTable("users", (d) => ({
  userId: d.serial("user_id").primaryKey(),
  fullName: d.varchar("full_name", { length: 100 }).notNull(),
  email: d.varchar("email", { length: 100 }).notNull().unique(),
  status: d.smallint().default(1),
  passwordHash: d.varchar("password_hash", { length: 100 }).notNull(),
  passwordCreatedAt: d.timestamp("password_created_at", { mode: "date", withTimezone: true }),
  passwordUpdatedAt: d.timestamp("password_updated_at", { mode: "date", withTimezone: true }),
  enrollmentNumber: d.varchar("enrollment_number", { length: 20 }),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow(),
  resetToken: d.varchar("reset_token", { length: 100 }),
  resetTokenExpires: d.timestamp("reset_token_expires", { mode: "date", withTimezone: true }),
}));

// COMPANIES
export const companies = pgTable("companies", (d) => ({
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
}));

// ROLES
export const roles = pgTable("roles", (d) => ({
  roleId: d.serial("role_id").primaryKey(),
  name: d.varchar("name", { length: 100 }).notNull().unique(),
  description: d.text("description"),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow(),
}));

// PERMISSIONS
export const permissions = pgTable("permissions", (d) => ({
  permissionId: d.serial("permission_id").primaryKey(),
  name: d.varchar("name", { length: 100 }).notNull(),
  description: d.text("description"),
  resource: d.varchar("resource", { length: 100 }).notNull(),
  action: d.varchar("action", { length: 50 }).notNull(),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow(),
}));

// ROLE ↔ PERMISSION (M:N)
export const rolePermissions = pgTable("role_permissions", (d) => ({
  id: d.serial("id").primaryKey(),
  roleId: d.integer("role_id").references(() => roles.roleId).notNull(),
  permissionId: d.integer("permission_id").references(() => permissions.permissionId).notNull(),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
}));

// USER ↔ COMPANY ↔ ROLE (com empresa obrigatória)
export const userRoles = pgTable("user_roles", (d) => ({
  id: d.serial("id").primaryKey(),
  userId: d.integer("user_id").references(() => users.userId).notNull(),
  companyId: d.integer("company_id").references(() => companies.companyId).notNull(),
  roleId: d.integer("role_id").references(() => roles.roleId).notNull(),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
}));
