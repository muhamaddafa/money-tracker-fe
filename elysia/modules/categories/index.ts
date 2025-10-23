import Elysia from "elysia";
import { addCategoryList, getCategoryList } from "./service";

export const categoriesAPI = new Elysia({prefix: "/categories"})
  .use(getCategoryList)
  .use(addCategoryList)
  // .use(editCategoryList)