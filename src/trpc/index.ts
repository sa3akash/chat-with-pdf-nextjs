import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "@trpc/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@db/index";
import * as z from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const user = getKindeServerSession().getUser();

    if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    // create a new user
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),

  // get all files

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),

  // delete one files
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user, userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
          userId,
        },
      });

      return file;
    }),

  // get files uploadthing

  getFile: privateProcedure.input(z.object({key: z.string()})).mutation(async({ctx,input})=>{
    const {userId} = ctx

    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId
      }
    })

    if(!file) throw new TRPCError({code: "NOT_FOUND"})

    return file;

  })

});

export type AppRouter = typeof appRouter;
