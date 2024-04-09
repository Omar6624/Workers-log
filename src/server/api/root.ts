import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { adminRouter } from "./routers/admin";
import { workerRouter } from "./routers/worker";
import { addressRouter } from "./routers/address";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  admin: adminRouter,
  worker: workerRouter,
  user: userRouter,
  address: addressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
