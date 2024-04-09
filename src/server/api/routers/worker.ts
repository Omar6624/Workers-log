import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedProcedureForAdmin,
} from "../trpc";

export const workerRouter = createTRPCRouter({
  getAllWrokers: protectedProcedureForAdmin.query(async ({ ctx }) => {
    const workers = await ctx.prisma.worker.findMany({
      include: {
        address: {
          include: { postOffice: true },
        },
      },
    });
    return {
      workers,
    };
  }),
});
