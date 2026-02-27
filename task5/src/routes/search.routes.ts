import Router from "@koa/router";
import * as searchControllers from "../controllers/search.controller";

const searchRouter = new Router();

searchRouter.get('/', searchControllers.searchFunciton2);

export default searchRouter;