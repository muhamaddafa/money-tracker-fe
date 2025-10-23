import Elysia from "elysia";
import { getBalance } from "./service";

export const balanceAPI = new Elysia({prefix: "/balance"})
  .use(getBalance);