import Router from "@koa/router";
import { fetchController, syncController } from "../controllers";

const router = new Router();

router.get('/fetch', fetchController);
router.get('/sync', syncController);

export default router;