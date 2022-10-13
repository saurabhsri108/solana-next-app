import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import * as trpc from '@trpc/server';
import { createRouter } from '../createRouter';
import { OrderSchema, orderSchema, OrderSuccessSchema, orderSuccessSchema } from 'src/schema/order.schema';
import { Prisma } from '@prisma/client';
import { string } from 'zod';

const UNIQUE_CONTRAINT_ERROR_CODE = "P2002";
const RAW_QUERY_ERROR_CODE = "P2010";
async function handleError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
        console.log("order-error-code:::", error.code);
        if (error.code === UNIQUE_CONTRAINT_ERROR_CODE) {
            throw new trpc.TRPCError({
                code: "CONFLICT",
                message: "Order already exist!"
            });
        }
        if (error.code === RAW_QUERY_ERROR_CODE) {
            console.error(error.message);
        }
        throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong in order"
        });
    }
    if (error instanceof PrismaClientValidationError) {
        console.log("order-error-name:::", error.name);
        console.log("order-error-message:::", error.message);
        throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }
}

export const orderRouter = createRouter()
    .mutation('add-order', {
        input: orderSchema,
        resolve: async ({ ctx, input }) => {
            const { userId, products, status } = input;
            try {
                let order: OrderSchema;
                const existingOrder = await ctx.prisma.order.count({
                    where: { userId: userId, status: status }
                });
                console.log({ userId, products, status });
                console.log("server-existing-order:::", existingOrder);
                if (existingOrder) {
                    order = await ctx.prisma.$queryRaw`
                        UPDATE
                            railway.Order
                        SET railway.Order.userId=${userId},
                            railway.Order.products=${products},
                            railway.Order.status=${status}
                        WHERE railway.Order.userId=${userId} AND railway.Order.status=${status}
                    `;
                } else {
                    order = await ctx.prisma.order.create({
                        data: {
                            userId, products: products!, status
                        }
                    });
                }
                return order;
            } catch (error) {
                handleError(error);
            }
        }
    })
    .mutation('update-transaction-status', {
        input: orderSuccessSchema,
        resolve: async ({ ctx, input }) => {
            const { userId, blockTime, signatureInfo, slot } = input;
            try {
                let order: OrderSuccessSchema;
                const existingOrder = await ctx.prisma.order.count({
                    where: { userId, status: "IN_CART" }
                });
                const status = "COMPLETED";
                const oldStatus = "IN_CART";
                if (existingOrder) {
                    order = await ctx.prisma.$queryRaw`
                        UPDATE
                            railway.Order
                        SET
                            railway.Order.status=${status},
                            railway.Order.blockTime=${blockTime},
                            railway.Order.signatureInfo=${signatureInfo},
                            railway.Order.slot=${slot}
                        WHERE railway.Order.userId=${userId} AND railway.Order.status=${oldStatus}
                    `;
                    return order;
                }
            } catch (error) {
                handleError(error);
            }
        }
    })
    .query('get-order', {
        input: orderSchema,
        resolve: async ({ ctx, input }) => {
            const { userId, status } = input;
            try {
                console.log({ userId, status });
                const orderCount = await ctx.prisma.order.count({ where: { userId, status } });
                console.log({ orderCount, "!orderCount": !orderCount });
                if (!orderCount) {
                    return {};
                }
                const order: { products: string; }[] = await ctx.prisma.$queryRaw`SELECT railway.Order.id,railway.Order.products FROM railway.Order WHERE railway.Order.userId=${userId} AND railway.Order.status=${status}`;
                return order[0];
            } catch (error) {
                handleError(error);
            }
        }
    });