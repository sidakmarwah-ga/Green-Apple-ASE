import Router from "@koa/router";
import productRouter from "./product.routes";
import variantRouter from "./variant.routes";
import collectionRouter from "./collection.routes";
import customerRouter from "./customer.routes";
import orderRouter from "./order.routes";
import searchRouter from "./search.routes";

const router = new Router();

router.use('/products', productRouter.routes());
router.use('/variants', variantRouter.routes());
router.use('/collections', collectionRouter.routes());
router.use('/customers', customerRouter.routes());
router.use('/orders', orderRouter.routes());
router.use('/search', searchRouter.routes());

export default router;