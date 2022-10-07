import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { createUserSchema, getUserSchema, updateWalletSchema } from 'src/schema/user.schema';
import * as trpc from '@trpc/server';
import { createRouter } from '../createRouter';
import { User } from '@prisma/client';

const UNIQUE_CONTRAINT_ERROR_CODE = "P2002";

async function handleError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === UNIQUE_CONTRAINT_ERROR_CODE) {
            throw new trpc.TRPCError({
                code: "CONFLICT",
                message: "User already exist!"
            });
        }
        throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong"
        });
    }
}

export const userRouter = createRouter()
    .mutation('register-user', {
        input: createUserSchema,
        resolve: async ({ ctx, input }) => {
            const { name, nickname, picture, sid, sub, email, provider, email_verified } = input;
            try {
                const user: User = await ctx.prisma.user.upsert({
                    where: { email },
                    create: {
                        email,
                        email_verified,
                        provider,
                        name,
                        nickname,
                        picture,
                        sid,
                        sub
                    },
                    update: {
                        email_verified,
                        picture,
                        provider,
                        sid,
                        sub
                    }
                });
                return user;
            } catch (error) {
                await handleError(error);
            }
        }
    })
    .mutation('update-wallet-address', {
        input: updateWalletSchema,
        resolve: async ({ ctx, input }) => {
            try {
                const { email, walletAddress } = input;
                const user = await ctx.prisma.user.update({
                    where: { email },
                    data: { walletAddress }
                });
            } catch (error) {
                await handleError(error);
            }
        }
    })
    .query('get-user', {
        input: getUserSchema,
        resolve: async ({ ctx, input }) => {
            const { email } = input;
            try {
                const user = await ctx.prisma.user.findUnique({
                    where: { email }
                });
                return user;
            } catch (error) {
                await handleError(error);
            }
        }
    });
