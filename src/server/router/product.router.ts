import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { getTotalPriceSchema, productByIdsSchema, productSchema } from 'src/schema/product.schema';
import * as trpc from '@trpc/server';
import { createRouter } from '../createRouter';
import BigNumber from 'bignumber.js';
import { prisma } from 'src/utils/prisma';

const UNIQUE_CONTRAINT_ERROR_CODE = "P2002";
async function handleError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
        console.error("product-error-code:::", error.code);
        if (error.code === UNIQUE_CONTRAINT_ERROR_CODE) {
            throw new trpc.TRPCError({
                code: "CONFLICT",
                message: "Product already exist!"
            });
        }
        throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong in product"
        });
    }
    if (error instanceof PrismaClientValidationError) {
        console.error("product-error-name:::", error.name);
        console.error("product-error-message:::", error.message);
        throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message
        });
    }
}

export const productRouter = createRouter()
    .query('get-all-products', {
        input: productSchema,
        resolve: async ({ ctx }) => {
            try {
                const products = await ctx.prisma.product.findMany();
                return products;
            } catch (error) {
                handleError(error);
            }
        }
    })
    .query('get-products-by-ids', {
        input: productByIdsSchema,
        resolve: async ({ ctx, input }) => {
            const { ids } = input;
            try {
                const splitIds = ids.split(",");
                const products = await ctx.prisma.product.findMany({
                    where: { id: { in: splitIds } }
                });
                return products;
            } catch (error) {
                handleError(error);
            }
        }
    })
    .query('get-total-price', {
        input: getTotalPriceSchema,
        resolve: async ({ ctx, input }) => {
            const { paymentMethod, productIds } = input;
            let amount = new BigNumber(0);
            if (!!productIds) {
                const productIdS = productIds.split(",");
                const storedProducts = await prisma.product.findMany({
                    where: { id: { in: productIdS } }
                });
                for (const product of storedProducts) {
                    if (paymentMethod === 'usd' || paymentMethod === 'qr-usd') {
                        amount = amount.plus(product.priceUSD);
                    }
                    if (paymentMethod === 'sol' || paymentMethod === 'qr-sol') {
                        amount = amount.plus(product.priceSOL);
                    }
                }
            }
            const price = new BigNumber(amount.toFixed(2));
            const shipping = new BigNumber(price.multipliedBy(0.2).toFixed(2));
            const totalPrice = new BigNumber(price.plus(shipping).toFixed(2));
            return { price, shipping, totalPrice };
        }
    });