import { publicProcedure } from "./../trpc";
import { prisma } from "./../../db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const addressRouter = createTRPCRouter({
  getPostOffices: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.postOffice.findMany();
  }),
});
