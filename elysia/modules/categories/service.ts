import Elysia from "elysia";
import { supabase } from "../../libs/supabase";
import { CustomHttpError, CustomHttpSuccess } from "../../libs/ResponseHandler";
import { AddCategoryRequest, EditCategoryRequest } from "./model";

export const getCategoryList = new Elysia()
  .get("/", async ({ query }) => {

    if (Object.keys(query).some(key => key !== "type")) {
      return CustomHttpError("Bad Request", 400);
    }

    if (
      query.type !== undefined &&
      (typeof query.type !== "string" ||
      query.type.trim() === "" ||
      (query.type !== "income" && query.type !== "expense"))
    ) {
      return CustomHttpError("Bad Request", 400);
    }

    const { data, error } = await supabase.rpc('get_category_list', {
      _type: query.type || null,
    });

    if (data.length === 0) {
      return CustomHttpError("Categories not found", 404);
    }

    if (error) {
      return CustomHttpError(error.message);
    }

    return CustomHttpSuccess({ data });
  })
  .all("/", () => CustomHttpError("Method not allowed", 405));

export const addCategoryList = new Elysia()
  .post("/add", async ({ body }) => {

    const reqBody = body as AddCategoryRequest;

    if (
      !reqBody ||
      typeof reqBody.description !== "string" ||
      typeof reqBody.type !== "string" ||
      reqBody.description.trim() === "" ||
      (reqBody.type !== "income" && reqBody.type !== "expense")
    ) {
      return CustomHttpError("Bad Request", 400);
    }

    const { error } = await supabase.rpc('add_category', {
      _name: reqBody.description,
      _type: reqBody.type
    });

    if (error) {
      return CustomHttpError(error.message);
    }

    return CustomHttpSuccess();
  })
  .all("/add", () => CustomHttpError("Method not allowed", 405));

export const editCategoryList = new Elysia()
  .put("/edit", async ({ body }) => {

    const reqBody = body as EditCategoryRequest;

    if (
      !reqBody ||
      typeof reqBody.id !== "string" ||
      typeof reqBody.description !== "string" ||
      reqBody.description.trim() === ""
    ) {
      return CustomHttpError("Bad Request", 400);
    }

    const { error } = await supabase.rpc('edit_category', {
      _id: reqBody.id,
      _description: reqBody.description
    });

    if (error) {
      return CustomHttpError(error.message);
    }

    return CustomHttpSuccess();
  })
  .all("/edit", () => CustomHttpError("Method not allowed", 405));