import z from 'zod';

export const createUserSchema = z.object({
    name: z.string().optional(),
    nickname: z.string().optional(),
    picture: z.string().optional(),
    sid: z.unknown().optional(),
    sub: z.string().optional(),
    email: z.string().email(),
    email_verified: z.boolean(),
    provider: z.string(),
});
export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export const updateWalletSchema = z.object({
    email: z.string().email(),
    walletAddress: z.string()
});
export type UpdateWalletInput = z.TypeOf<typeof updateWalletSchema>;

export const getUserSchema = z.object({
    email: z.string().email()
});
export type GetUserInput = z.TypeOf<typeof getUserSchema>;