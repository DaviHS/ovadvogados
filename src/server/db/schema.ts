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
}));