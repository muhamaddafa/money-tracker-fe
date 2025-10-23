import Elysia from "elysia";
import { addAccounts, getAccountList } from "./service";

export const accountsAPI = new Elysia({prefix: "/accounts"})
  .use(getAccountList)
  .use(addAccounts)
  // .use(editCategoryList)