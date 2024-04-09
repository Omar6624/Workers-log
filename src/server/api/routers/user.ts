import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedProcedureForAdmin,
} from "../trpc";

export const userRouter = createTRPCRouter({
  completeUserInfo: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        phone: z.string(),
        postCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, phone, postCode } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const postOffice = await ctx.prisma.postOffice.findUnique({
        where: {
          postCode,
        },
      });
      if (!postOffice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post office not found",
        });
      }
      const address = await ctx.prisma.address.upsert({
        where: {
          userId,
        },
        update: {
          postOfficeId: postOffice.id,
        },
        create: {
          userId,
          postOfficeId: postOffice.id,
        },
      });

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          phone,
          address: {
            connect: {
              id: address.id,
            },
          },
          hasCompletedProfile: true,
        },
      });
    }),
});
