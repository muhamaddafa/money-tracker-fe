import Elysia from "elysia";
import { transactionsAPI } from "./transactions";
import { balanceAPI } from "./balance";
import { categoriesAPI } from "./categories";
import { CustomHttpError } from "../libs/ResponseHandler";
import { accountsAPI } from "./accounts";

export const api = new Elysia({prefix: "/api"})
  .use(transactionsAPI)
  .use(balanceAPI)
  .use(categoriesAPI)
  .use(accountsAPI)
  .all("*", () => CustomHttpError("Endpoint not found", 404));