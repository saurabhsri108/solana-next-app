import z from 'zod';

export const productSchema = z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    priceUSD: z.number(),
    priceSOL: z.number(),
    rating: z.number(),
    imageURL: z.string()
});
export type ProductSchema = z.infer<typeof productSchema>;

export const productByIdsSchema = z.object({
    ids: z.string()
});
export type ProductByIdsSchema = z.infer<typeof productByIdsSchema>;

export const getTotalPriceSchema = z.object({
    paymentMethod: z.enum(['sol', 'usd', 'qr-sol', 'qr-usd']),
    productIds: z.string()
});
export type GetTotalPriceSchema = z.infer<typeof getTotalPriceSchema>;