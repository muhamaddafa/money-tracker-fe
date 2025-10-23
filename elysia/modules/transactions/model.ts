import { z } from "zod";

export const addTransactionSchema = z.object({
  accountId: z.number(),
  categoryId: z.number(),
  description: z.string(),
  amount: z.number(),
  trxType: z.enum(["income", "expense"])
});

export const getTransactionListQuerySchema = z.object({
  description: z.string().optional(),
  trxType: z.enum(["income", "expense"]).optional(),
  categoryId: z.number().optional(),
  accountId: z.number().optional(),
  pageNumber: z.number().optional().default(1),
  pageSize: z.number().optional().default(10)
});

export const editTransactionSchema = z.object({
  transactionId: z.number(),
  accountId: z.number().optional(),
  categoryId: z.number().optional(),
  description: z.string().optional(),
  amount: z.number().optional(),
  trxType: z.enum(["income", "expense"]).optional()
});

export type AddTransactionRequest = z.infer<typeof addTransactionSchema>;
export type GetTransactionListQuery = z.infer<typeof getTransactionListQuerySchema>;
export type EditTransactionRequest = z.infer<typeof editTransactionSchema>;