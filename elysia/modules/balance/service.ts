import Elysia from "elysia";
import { supabase } from "../../libs/supabase";
import { CustomHttpError, CustomHttpSuccess } from "../../libs/ResponseHandler";

export const getBalance = new Elysia()
  .get("/", async ({ query }) => {

    const { data, error } = await supabase.rpc('get_total_balance', {
      _account_id: query.accountId || null,
    });

    if (error) {
      return CustomHttpError(error.message);
    }

    return CustomHttpSuccess({ totalBalance: data[0].total_balance ?? 0 });
  });