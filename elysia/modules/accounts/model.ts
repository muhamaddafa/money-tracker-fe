import { z } from "zod";

export const addAccountsSchema = z.object({
  name: z.string(),
  currentBalance: z.number()
});

export type AddAccountsRequest = z.infer<typeof addAccountsSchema>;