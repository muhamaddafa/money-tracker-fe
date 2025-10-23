import Elysia from "elysia";
import { addTransaction, editTransaction, getTransactionList } from "./service";

export const transactionsAPI = new Elysia({prefix: "/transactions"})
  .use(getTransactionList)
  .use(addTransaction)
  .use(editTransaction)