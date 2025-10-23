import Elysia from "elysia";
import { supabase } from "../../libs/supabase";
import { CustomHttpError, CustomHttpSuccess } from "../../libs/ResponseHandler";
import { AddAccountsRequest } from "./model";

export const getAccountList = new Elysia()
  .get("/", async () => {

    const { data, error } = await supabase.rpc('get_account_list');

    if (data.length === 0) {
      return CustomHttpError("Accounts not found", 404);
    }

    if (error) {
      return CustomHttpError(error.message);
    }

    return CustomHttpSuccess({ data });
  })
  .all("/", () => CustomHttpError("Method not allowed", 405));

export const addAccounts = new Elysia()
  .post("/add", async ({ body }) => {

    const reqBody = body as AddAccountsRequest;

    if (
      !reqBody ||
      typeof reqBody.name !== "string" ||
      typeof reqBody.currentBalance !== "number" ||
      reqBody.name.trim() === "" ||
      reqBody.currentBalance < 0
    ) {
      return CustomHttpError("Bad Request", 400);
    }

    const { error } = await supabase.rpc('add_account', {
      _name: reqBody.name,
      _curr_balance: reqBody.currentBalance 
    });

    if (error) {
      return CustomHttpError(error.message);
    }

    return CustomHttpSuccess();
  })
  .all("/add", () => CustomHttpError("Method not allowed", 405));

// export const editTransaction = new Elysia()
//   .put("/edit", async ({ body }) => {
    
//     const reqBody = body as EditTransactionRequest;
//     if (
//       !reqBody ||
//       typeof reqBody.transactionId !== "number" ||
//       (reqBody.accountId !== undefined && typeof reqBody.accountId !== "number") ||
//       (reqBody.categoryId !== undefined && typeof reqBody.categoryId !== "number") ||
//       (reqBody.amount !== undefined && typeof reqBody.amount !== "number") ||
//       (reqBody.trxType !== undefined && typeof reqBody.trxType !== "string") ||
//       (reqBody.description !== undefined && typeof reqBody.description !== "string") ||
//       (reqBody.trxType !== undefined && reqBody.trxType.trim() === "") ||
//       (reqBody.amount !== undefined && reqBody.amount <= 0) ||
//       (reqBody.trxType !== undefined && reqBody.trxType !== "income" && reqBody.trxType !== "expense")
//     ) {
//       return CustomHttpError("Bad Request", 400);
//     }

//     const { error } = await supabase.rpc('update_transaction', {
//       _transaction_id: reqBody.transactionId,
//       _new_account_id: reqBody.accountId || null,
//       _new_category_id: reqBody.categoryId || null,
//       _new_description: reqBody.description || null,
//       _new_amount: reqBody.amount || null,
//       _new_type: reqBody.trxType || null
//     });

//     if (error) {
//       return CustomHttpError(error.message);
//     }

//     return CustomHttpSuccess();
//   })
//   .all("/edit", () => CustomHttpError("Method not allowed", 405));