import z from 'zod';

export const orderSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    products: z.string().optional(),
    status: z.enum(['IN_CART', 'COMPLETED']).optional()
});
export type OrderSchema = z.infer<typeof orderSchema>;