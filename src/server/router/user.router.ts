import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { createUserSchema, getUserSchema, updateWalletSchema } from 'src/schema/user.schema';
import * as trpc from '@trpc/server';
import { createRouter } from '../createRouter';
import { User } from '@prisma/client';

const UNIQUE_CONTRAINT_ERROR_CODE = "P2002";
async function handleError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
        console.error("user-error-code:::", error.code);
        if (error.code === UNIQUE_CONTRAINT_ERROR_CODE) {
            throw new trpc.TRPCError({
                code: "CONFLICT",
                message: "User already exist!"
            });
        }
        throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong in user"
        });
    }
    if (error instanceof PrismaClientValidationError) {
        console.error("user-error-name:::", error.name);
        console.error("user-error-message:::", error.message);
        throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }
}

export const userRouter = createRouter()
    .mutation('register-user', {
        input: createUserSchema,
        resolve: async ({ ctx, input }) => {
            const { name, nickname, picture, sid, sub, email, provider, email_verified } = input;
            try {
                const user = await ctx.prisma.user.upsert({
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
                    },
                    select: {
                        id: true,
                        email: true,
                        email_verified: true,
                        name: true,
                        nickname: true,
                        picture: true,
                        sid: true,
                        sub: true,
                        walletAddress: true
                    }
                });
                // console.log("server-register-user:::", user);
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
                return {
                    ...user,
                    created_at: user?.created_at.toString(),
                    updated_at: user?.updated_at.toString()
                };
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
                return {
                    ...user,
                    created_at: user?.created_at.toString(),
                    updated_at: user?.updated_at.toString()
                };
            } catch (error) {
                await handleError(error);
            }
        }
    });
