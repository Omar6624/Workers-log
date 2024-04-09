import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedProcedureForAdmin,
} from "../trpc";

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ input, ctx }) => {
      const admin = await ctx.prisma.admin.findFirst({
        where: {
          email: input.email,
          password: input.password,
        },
      });

      if (admin)
        return {
          success: true,
          admin,
        };
      else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Admin not found",
        });
      }
    }),
  getAdmin: protectedProcedureForAdmin
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const admin = await ctx.prisma.admin.findUnique({
        where: {
          accessToken: input.id,
        },
      });

      if (admin)
        return {
          success: true,
          admin,
        };
      else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Admin not found",
        });
      }
    }),

  getCategories: protectedProcedureForAdmin.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany();
    console.log(
      "🚀 ~ file: admin.ts:58 ~ getCategories:protectedProcedureForAdmin.query ~ categories",
      categories
    );

    if (!categories)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Categories not found",
      });

    return {
      categories,
    };
  }),

  addCategory: protectedProcedureForAdmin
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const category = await ctx.prisma.category.create({
        data: {
          categoryName: input.name,
          details: input.description,
        },
      });

      if (!category)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category could not be created",
        });

      return {
        category,
      };
    }),

  deleteCategory: protectedProcedureForAdmin
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const category = await ctx.prisma.category.delete({
        where: {
          id: input.id,
        },
      });

      if (!category)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category could not be deleted",
        });

      return {
        success: true,
      };
    }),

  getServicesByCategory: protectedProcedureForAdmin
    .input(z.object({ catId: z.string() }))
    .query(async ({ ctx, input }) => {
      const services = await ctx.prisma.service.findMany({
        where: {
          categoryId: input.catId,
        },
      });

      if (!services)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Services not found",
        });

      return {
        services,
      };
    }),

  addService: protectedProcedureForAdmin
    .input(
      z.object({
        serviceName: z.string(),
        categoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const service = await ctx.prisma.service.create({
        data: {
          serviceName: input.serviceName,
          categoryId: input.categoryId,
        },
      });

      if (!service)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Service could not be created",
        });

      return {
        service,
      };
    }),

  deleteService: protectedProcedureForAdmin
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const service = await ctx.prisma.service.delete({
        where: {
          id: input.id,
        },
      });

      if (!service)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Service could not be deleted",
        });

      return {
        success: true,
      };
    }),

  getCriticalitiesByService: protectedProcedureForAdmin
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const criticalities = await ctx.prisma.criticality.findMany({
        where: {
          serviceId: input.id,
        },
      });

      if (!criticalities)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Criticalities not found",
        });

      return {
        criticalities,
      };
    }),
  addCriticality: protectedProcedureForAdmin
    .input(
      z.object({
        criticalityName: z.string(),
        description: z.string().optional(),
        price: z.number(),
        serviceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const criticality = await ctx.prisma.criticality.create({
        data: {
          criticalityName: input.criticalityName,
          description: input.description,
          price: input.price,
          serviceId: input.serviceId,
        },
      });

      if (!criticality)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Criticality could not be created",
        });

      return {
        criticality,
      };
    }),

  deleteCriticality: protectedProcedureForAdmin
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const criticality = await ctx.prisma.criticality.delete({
        where: {
          id: input.id,
        },
      });

      if (!criticality)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Criticality could not be deleted",
        });

      return {
        success: true,
      };
    }),
});
