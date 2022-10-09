import z from 'zod';

export const createUserSchema = z.object({
    name: z.string().optional(),
    nickname: z.string().optional(),
    picture: z.string().optional(),
    sid: z.string().optional(),
    sub: z.string().optional(),
    email: z.string().email(),
    email_verified: z.boolean(),
    provider: z.string(),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateWalletSchema = z.object({
    email: z.string().email(),
    walletAddress: z.string()
});
export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;

export const getUserSchema = z.object({
    email: z.string().email()
});
export type GetUserInput = z.infer<typeof getUserSchema>;

export const dbUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    email_verified: z.boolean(),
    name: z.string().optional(),
    nickname: z.string().optional(),
    picture: z.string().optional(),
    sid: z.string().optional(),
    sub: z.string().optional(),
    walletAddress: z.string().optional(),
    order: z.string().array().optional()
});
export type DBUserSchema = z.infer<typeof dbUserSchema>;