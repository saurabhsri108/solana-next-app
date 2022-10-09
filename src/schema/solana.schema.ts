import z from 'zod';

export const makeTransactionInputSchema = z.object({
    userId: z.string(),
    walletAddress: z.string(),
    orderId: z.string()
});
export type IMakeTransactionInputData = z.infer<typeof makeTransactionInputSchema>;

export const makeTransactionOutputSchema = z.object({
    transaction: z.string(),
    message: z.string()
});
export type IMakeTransactionOutputData = z.infer<typeof makeTransactionOutputSchema>;

export const errorOutputSchema = z.object({
    error: z.string()
});
export type IErrorOutput = z.infer<typeof errorOutputSchema>;