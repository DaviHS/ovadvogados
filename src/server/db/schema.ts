import { pgTable, serial, varchar, text, boolean, jsonb, timestamp, integer, smallint, date, uniqueIndex } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

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
}))

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
}))

// ROLES - Atualizado com campos extras
export const roles = pgTable("roles", (d) => ({
  roleId: d.serial("role_id").primaryKey(),
  name: d.varchar("name", { length: 50 }).notNull().unique(),
  description: d.text("description"),
  isSystemRole: d.boolean("is_system_role").default(false),
  permissions: d.jsonb("permissions").default({}),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow(),
}))

// PERMISSIONS - Atualizado com campos extras
export const permissions = pgTable("permissions", (d) => ({
  permissionId: d.serial("permission_id").primaryKey(),
  name: d.varchar("name", { length: 100 }).notNull(),
  description: d.text("description"),
  resource: d.varchar("resource", { length: 50 }).notNull(),
  action: d.varchar("action", { length: 50 }).notNull(),
  category: d.varchar("category", { length: 50 }).default("general"),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow(),
}), (table) => {
  return {
    resourceActionUnique: uniqueIndex("resource_action_unique").on(table.resource, table.action),
  }
})

// ROLE ↔ PERMISSION (M:N) - Atualizado com campo granted
export const rolePermissions = pgTable("role_permissions", (d) => ({
  id: d.serial("id").primaryKey(),
  roleId: d.integer("role_id").references(() => roles.roleId, { onDelete: "cascade" }).notNull(),
  permissionId: d.integer("permission_id").references(() => permissions.permissionId, { onDelete: "cascade" }).notNull(),
  granted: d.boolean("granted").default(true),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
}), (table) => {
  return {
    rolePermissionUnique: uniqueIndex("role_permission_unique").on(table.roleId, table.permissionId),
  }
})

// USER ↔ COMPANY ↔ ROLE - Atualizado com campos extras
export const userRoles = pgTable("user_roles", (d) => ({
  id: d.serial("id").primaryKey(),
  userId: d.integer("user_id").references(() => users.userId, { onDelete: "cascade" }).notNull(),
  companyId: d.integer("company_id").references(() => companies.companyId, { onDelete: "cascade" }).notNull(),
  roleId: d.integer("role_id").references(() => roles.roleId, { onDelete: "cascade" }).notNull(),
  assignedBy: d.integer("assigned_by").references(() => users.userId),
  assignedAt: d.timestamp("assigned_at", { mode: "date", withTimezone: true }).defaultNow(),
  expiresAt: d.timestamp("expires_at", { mode: "date", withTimezone: true }),
  isActive: d.boolean("is_active").default(true),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
}), (table) => {
  return {
    userCompanyRoleUnique: uniqueIndex("user_company_role_unique").on(
      table.userId,
      table.companyId,
      table.roleId
    ),
  }
})

// USER SPECIAL PERMISSIONS - Nova tabela para permissões especiais
export const userSpecialPermissions = pgTable("user_special_permissions", (d) => ({
  id: d.serial("id").primaryKey(),
  userId: d.integer("user_id").references(() => users.userId, { onDelete: "cascade" }).notNull(),
  companyId: d.integer("company_id").references(() => companies.companyId, { onDelete: "cascade" }).notNull(),
  permissionId: d.integer("permission_id").references(() => permissions.permissionId, { onDelete: "cascade" }).notNull(),
  granted: d.boolean("granted").default(true),
  grantedBy: d.integer("granted_by").references(() => users.userId),
  grantedAt: d.timestamp("granted_at", { mode: "date", withTimezone: true }).defaultNow(),
  reason: d.text("reason"),
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
}), (table) => {
  return {
    userCompanyPermissionUnique: uniqueIndex("user_company_permission_unique").on(
      table.userId,
      table.companyId,
      table.permissionId
    ),
  }
})

// WALKAROUNDS / HANDLINGS
export const handlings = pgTable("handlings", (d) => ({
  handlingId: d.serial("handling_id").primaryKey(),
  companyId: d.integer("company_id").references(() => companies.companyId).notNull(),
  userId: d.integer("user_id").references(() => users.userId).notNull(),
  
  // Flight Identification
  flightNumber: d.varchar("flight_number", { length: 20 }).notNull(),
  aircraftRegistration: d.varchar("aircraft_registration", { length: 20 }).notNull(),
  timeCompleted: d.varchar("time_completed", { length: 10 }).notNull(),
  date: d.date("date").notNull(),
  teamLeader: d.varchar("team_leader", { length: 100 }).notNull(),
  collectionInfo: d.text("collection_info"),
  client: d.varchar("client", { length: 100 }).notNull(),
  flightType: d.varchar("flight_type", { length: 20 }).notNull(), // 'arrival' or 'departure'
  base: d.varchar("base", { length: 10 }).notNull(),
  
  // Flight Data
  arrivalFlight: d.varchar("arrival_flight", { length: 20 }),
  departureFlight: d.varchar("departure_flight", { length: 20 }),
  aircraftModel: d.varchar("aircraft_model", { length: 50 }),
  registration: d.varchar("registration", { length: 50 }),
  chocksOn: d.varchar("chocks_on", { length: 10 }),
  releaseTime: d.varchar("release_time", { length: 10 }),
  origin: d.varchar("origin", { length: 100 }),
  destination: d.varchar("destination", { length: 100 }),
  parkingPosition: d.varchar("parking_position", { length: 20 }),
  
  // JSON fields for complex data
  disembarkation: d.json("disembarkation"),
  boarding: d.json("boarding"),
  personnel: d.json("personnel"),
  equipmentList: d.json("equipment_list"),
  inspectionPoints: d.json("inspection_points"),
  cargoHoldItems: d.json("cargo_hold_items"),
  
  // Damage Report
  damageDetected: d.boolean("damage_detected").default(false),
  damageDescription: d.text("damage_description"),
  damagePhotos: d.json("damage_photos"), // Array of photo URLs
  
  // Cancellation
  cancellationRequester: d.varchar("cancellation_requester", { length: 100 }),
  cancellationReason: d.text("cancellation_reason"),
  
  // Signature
  responsibleName: d.varchar("responsible_name", { length: 100 }),
  responsibleId: d.varchar("responsible_id", { length: 50 }),
  representativeName: d.varchar("representative_name", { length: 100 }),
  representativeId: d.varchar("representative_id", { length: 50 }),
  
  // General Notes
  generalNotes: d.text("general_notes"),
  
  // Timestamps
  createdAt: d.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow(),
  status: d.smallint("status").default(1), // 1=active, 0=inactive
}))

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  userSpecialPermissions: many(userSpecialPermissions),
  assignedRoles: many(userRoles, { relationName: "assignedBy" }),
  grantedPermissions: many(userSpecialPermissions, { relationName: "grantedBy" }),
  handlings: many(handlings),
}))

export const companiesRelations = relations(companies, ({ many }) => ({
  userRoles: many(userRoles),
  userSpecialPermissions: many(userSpecialPermissions),
  handlings: many(handlings),
}))

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}))

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  userSpecialPermissions: many(userSpecialPermissions),
}))

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.userId],
  }),
  company: one(companies, {
    fields: [userRoles.companyId],
    references: [companies.companyId],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.roleId],
  }),
  assignedByUser: one(users, {
    fields: [userRoles.assignedBy],
    references: [users.userId],
    relationName: "assignedBy",
  }),
}))

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.roleId],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.permissionId],
  }),
}))

export const userSpecialPermissionsRelations = relations(userSpecialPermissions, ({ one }) => ({
  user: one(users, {
    fields: [userSpecialPermissions.userId],
    references: [users.userId],
  }),
  company: one(companies, {
    fields: [userSpecialPermissions.companyId],
    references: [companies.companyId],
  }),
  permission: one(permissions, {
    fields: [userSpecialPermissions.permissionId],
    references: [permissions.permissionId],
  }),
  grantedByUser: one(users, {
    fields: [userSpecialPermissions.grantedBy],
    references: [users.userId],
    relationName: "grantedBy",
  }),
}))

export const handlingsRelations = relations(handlings, ({ one }) => ({
  company: one(companies, {
    fields: [handlings.companyId],
    references: [companies.companyId],
  }),
  user: one(users, {
    fields: [handlings.userId],
    references: [users.userId],
  }),
}))