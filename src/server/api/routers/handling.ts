import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { handlings } from "@/server/db/schema";
import { handlingSchema } from "@/validators/handling";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const handlingRouter = createTRPCRouter({
create: protectedProcedure
    .input(handlingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Garantir que temos company_id e user_id do contexto


        // Preparar os dados para inserção
        const handlingData = {
          ...input,
          companyId:  1, // Use o companyId do usuário ou um padrão
          userId: 0,
          
          flightNumber: input.flightNumber || "N/A",
          aircraftRegistration: input.aircraftRegistration || "N/A",
          timeCompleted: input.timeCompleted || "00:00",
          date: input.date || new Date().toISOString().split('T')[0], // Data atual
          teamLeader: input.teamLeader || "N/A",
          client: input.client || "N/A",
          flightType: input.flightType || "arrival",
          base: input.base || "N/A",
          
          // Campos opcionais (podem ser undefined)
          collectionInfo: input.collectionInfo,
          arrivalFlight: input.arrivalFlight,
          departureFlight: input.departureFlight,
          aircraftModel: input.aircraftModel,
          registration: input.registration,
          chocksOn: input.chocksOn,
          releaseTime: input.releaseTime,
          origin: input.origin,
          destination: input.destination,
          parkingPosition: input.parkingPosition,
          
          // JSON fields - garantir objetos válidos
          disembarkation: input.disembarkation || {},
          boarding: input.boarding || {},
          personnel: input.personnel || {},
          equipmentList: input.equipmentList || [],
          inspectionPoints: input.inspectionPoints || [],
          cargoHoldItems: input.cargoHoldItems || [],
          damagePhotos: input.damagePhotos || [],
          
          // Damage Report
          damageDetected: input.damageDetected || false,
          damageDescription: input.damageDescription,
          
          // Cancellation
          cancellationRequester: input.cancellationRequester,
          cancellationReason: input.cancellationReason,
          
          // Signature
          responsibleName: input.responsibleName,
          responsibleId: input.responsibleId,
          representativeName: input.representativeName,
          representativeId: input.representativeId,
          
          // General Notes
          generalNotes: input.generalNotes,
          
          // Status
          status: 1,
        };

        const [newHandling] = await ctx.db
          .insert(handlings)
          .values(handlingData)
          .returning();

        return newHandling;
      } catch (error) {
        console.error("Erro ao criar handling:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar atendimento",
        });
      }
    }),

  list: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit, search } = input;
      const offset = (page - 1) * limit;

      let whereCondition = eq(handlings.companyId, 0);
      
      if (search) {
        whereCondition = and(
          whereCondition,
          // Add search conditions as needed
        ) as any;
      }

      const [items, [total]] = await Promise.all([
        ctx.db
          .select()
          .from(handlings)
          .where(whereCondition)
          .orderBy(desc(handlings.createdAt))
          .limit(limit)
          .offset(offset),
        ctx.db
          .select({ count: ctx.db.$count(handlings.handlingId) })
          .from(handlings)
          .where(whereCondition),
      ]);

      return {
        items,
        total: total?.count || 0,
        page,
        limit,
        totalPages: Math.ceil((total?.count || 0) / limit),
      };
    }),

  getById: protectedProcedure
    .input(z.object({ handlingId: z.number() }))
    .query(async ({ ctx, input }) => {
      const [handling] = await ctx.db
        .select()
        .from(handlings)
        .where(
          and(
            eq(handlings.handlingId, input.handlingId),
            eq(handlings.companyId, 0)
          )
        );

      if (!handling) {
        throw new Error("Handling not found");
      }

      return handling;
    }),

  update: protectedProcedure
    .input(z.object({ 
      handlingId: z.number(),
      data: handlingSchema 
    }))
    .mutation(async ({ ctx, input }) => {
      const [handling] = await ctx.db
        .update(handlings)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(handlings.handlingId, input.handlingId),
            eq(handlings.companyId, 0)
          )
        )
        .returning();

      if (!handling) {
        throw new Error("Handling not found");
      }

      return handling;
    }),

  delete: protectedProcedure
    .input(z.object({ handlingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(handlings)
        .where(
          and(
            eq(handlings.handlingId, input.handlingId),
            eq(handlings.companyId, 0)
          )
        );

      return { success: true };
    }),
});