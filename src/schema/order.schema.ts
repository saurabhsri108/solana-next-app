import z from 'zod';

export const orderSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    products: z.string().optional(),
    status: z.enum(['IN_CART', 'COMPLETED']).optional()
});
export type OrderSchema = z.infer<typeof orderSchema>;

export const orderSuccessSchema = z.object({
    userId: z.string(),
    blockTime: z.number(),
    signatureInfo: z.string(),
    slot: z.number()
});
export type OrderSuccessSchema = z.infer<typeof orderSuccessSchema>;