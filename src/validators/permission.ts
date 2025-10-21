import { z } from "zod";

export const permissionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional(),
  resource: z.string().min(1, "Recurso é obrigatório").max(100, "Recurso muito longo"),
  action: z.string().min(1, "Ação é obrigatória").max(50, "Ação muito longa"),
});

export const permissionUpdateSchema = z.object({
  permissionId: z.number(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional(),
  resource: z.string().min(1, "Recurso é obrigatório").max(100, "Recurso muito longo"),
  action: z.string().min(1, "Ação é obrigatória").max(50, "Ação muito longa"),
});

export const permissionDeleteSchema = z.object({
  permissionId: z.number(),
});
