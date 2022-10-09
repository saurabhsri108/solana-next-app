import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { productByIdsSchema, productSchema } from 'src/schema/product.schema';
import * as trpc from '@trpc/server';
import { createRouter } from '../createRouter';

const UNIQUE_CONTRAINT_ERROR_CODE = "P2002";
async function handleError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
        console.log("product-error-code:::", error.code);
        if (error.code === UNIQUE_CONTRAINT_ERROR_CODE) {
            throw new trpc.TRPCError({
                code: "CONFLICT",
                message: "Product already exist!"
            });
        }
        throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong"
        });
    }
    if (error instanceof PrismaClientValidationError) {
        console.log("product-error-name:::", error.name);
        console.log("product-error-message:::", error.message);
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
    });