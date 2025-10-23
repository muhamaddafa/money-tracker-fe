import Elysia from "elysia";
import { supabase } from "../../libs/supabase";
import { CustomHttpError, CustomHttpSuccess } from "../../libs/ResponseHandler";
import { AddTransactionRequest, EditTransactionRequest } from "./model";

export const getTransactionList = new Elysia()
  .get("/", async ({ query }) => {

    const { data, error } = await supabase.rpc('get_transaction_list', {
      _description: query.description || null,
      _trxtype: query.trxType || null,
      _category_id: query.categoryId || null,
      _account_id: query.accountId || null,
      _page_number: query.pageNumber || 1,
      _page_size: query.pageSize || 10
    });

    if (data.length === 0) {
      return CustomHttpError("Transactions not found", 404);
    }

    if (error) {
      return CustomHttpError(error.message);
    }

    return CustomHttpSuccess({ data });
  })
  .all("/", () => CustomHttpError("Method not allowed", 405));

export const addTransaction = new Elysia()
  .post("/add", async ({ body }) => {

    const reqBody = body as AddTransactionRequest;

    if (
      !reqBody ||
      typeof reqBody.accountId !== "string" ||
      typeof reqBody.categoryId !== "string" ||
      typeof reqBody.amount !== "number" ||
      typeof reqBody.trxType !== "string" ||
      typeof reqBody.description !== "string" ||
      reqBody.trxType.trim() === "" ||
      reqBody.amount <= 0 ||
      (reqBody.trxType !== "income" && reqBody.trxType !== "expense")
    ) {
      return CustomHttpError("Bad Request", 400);
    }

    const { error } = await supabase.rpc('add_transactions', {
      _account_id: reqBody.accountId,
      _category_id: reqBody.categoryId,
      _description: reqBody.description,
      _amount: reqBody.amount,
      _type: reqBody.trxType
    });

    if (error) {
      return CustomHttpError(error.message);
    }

    return CustomHttpSuccess();
  })
  .all("/add", () => CustomHttpError("Method not allowed", 405));

export const editTransaction = new Elysia()
  .put("/edit", async ({ body }) => {
    
    const reqBody = body as EditTransactionRequest;
    if (
      !reqBody ||
      typeof reqBody.transactionId !== "number" ||
      (reqBody.accountId !== undefined && typeof reqBody.accountId !== "string") ||
      (reqBody.categoryId !== undefined && typeof reqBody.categoryId !== "string") ||
      (reqBody.amount !== undefined && typeof reqBody.amount !== "number") ||
      (reqBody.trxType !== undefined && typeof reqBody.trxType !== "string") ||
      (reqBody.description !== undefined && typeof reqBody.description !== "string") ||
      (reqBody.trxType !== undefined && reqBody.trxType.trim() === "") ||
      (reqBody.amount !== undefined && reqBody.amount <= 0) ||
      (reqBody.trxType !== undefined && reqBody.trxType !== "income" && reqBody.trxType !== "expense")
    ) {
      return CustomHttpError("Bad Request", 400);
    }

    const { error } = await supabase.rpc('update_transaction', {
      _transaction_id: reqBody.transactionId,
      _new_account_id: reqBody.accountId || null,
      _new_category_id: reqBody.categoryId || null,
      _new_description: reqBody.description || null,
      _new_amount: reqBody.amount || null,
      _new_type: reqBody.trxType || null
    });

    if (error) {
      return CustomHttpError(error.message);
    }

    return CustomHttpSuccess();
  })
  .all("/edit", () => CustomHttpError("Method not allowed", 405));