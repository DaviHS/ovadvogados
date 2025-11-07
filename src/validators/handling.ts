import { z } from "zod";

// Sub-schemas
const disembarkationSchema = z.object({
  cargoDoorOpen: z.string().optional(),
  cargoDoorClose: z.string().optional(),
  firstBaggage: z.string().optional(),
  lastBaggage: z.string().optional(),
  firstCargo: z.string().optional(),
  lastCargo: z.string().optional(),
  towingStart: z.string().optional(),
  towingEnd: z.string().optional(),
}).optional();

const boardingSchema = z.object({
  cargoDoorOpen: z.string().optional(),
  cargoDoorClose: z.string().optional(),
  firstBaggage: z.string().optional(),
  lastBaggage: z.string().optional(),
  firstCargo: z.string().optional(),
  lastCargo: z.string().optional(),
  towingStart: z.string().optional(),
  towingEnd: z.string().optional(),
}).optional();

// Corrigir o schema de personnel para aceitar tanto objeto quanto string
const wingSchema = z.union([
  z.object({
    quantity: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
  z.string().optional() // Aceita string também
]);

const qevSchema = z.union([
  z.object({
    quantity: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
  z.string().optional() // Aceita string também
]);

const personnelSchema = z.object({
  wing: wingSchema.optional(),
  qev: qevSchema.optional(),
}).optional();

const equipmentUsedSchema = z.object({
  id: z.string(),
  equipment: z.string(),
  quantity: z.number(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  ptm: z.string().optional(),
  operator: z.string().optional(),
  registration: z.string().optional(),
}).optional();

const inspectionPointSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.object({
    top: z.string(),
    left: z.string(),
  }),
  checked: z.boolean(),
}).optional();

const cargoHoldItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  checked: z.boolean(),
  notes: z.string().optional(),
}).optional();

// Atualize o schema para ser mais permissivo
// No seu handlingSchema, atualize para:
// Em types/handling.ts - tornar campos obrigatórios realmente obrigatórios
export const handlingSchema = z.object({
  // Flight Identification - campos obrigatórios
  flightNumber: z.string().min(1, "Número do voo é obrigatório"),
  aircraftRegistration: z.string().min(1, "Registro da aeronave é obrigatório"),
  timeCompleted: z.string().default("00:00"),
  date: z.string().default(() => new Date().toISOString().split("T")[0] ?? ""),
  teamLeader: z.string().min(1, "Líder da equipe é obrigatório"),
  client: z.string().min(1, "Cliente é obrigatório"),
  flightType: z.enum(["arrival", "departure"]).default("arrival"),
  base: z.string().min(1, "Base é obrigatória"),
  
  // Campos opcionais
  collectionInfo: z.string().optional(),
  arrivalFlight: z.string().optional(),
  departureFlight: z.string().optional(),
  aircraftModel: z.string().optional(),
  registration: z.string().optional(),
  chocksOn: z.string().optional(),
  releaseTime: z.string().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  parkingPosition: z.string().optional(),
  
  // Complex data
  disembarkation: z.any().optional().default({}),
  boarding: z.any().optional().default({}),
  personnel: z.any().optional().default({}),
  equipmentList: z.array(z.any()).optional().default([]),
  inspectionPoints: z.array(z.any()).optional().default([]),
  cargoHoldItems: z.array(z.any()).optional().default([]),
  
  // Damage Report
  damageDetected: z.boolean().default(false),
  damageDescription: z.string().optional(),
  damagePhotos: z.array(z.string()).optional().default([]),
  
  // Cancellation
  cancellationRequester: z.string().optional(),
  cancellationReason: z.string().optional(),
  
  // Signature
  responsibleName: z.string().optional(),
  responsibleId: z.string().optional(),
  representativeName: z.string().optional(),
  representativeId: z.string().optional(),
  
  // General Notes
  generalNotes: z.string().optional(),
});

export type HandlingData = z.infer<typeof handlingSchema>;