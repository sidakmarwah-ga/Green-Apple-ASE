import Router from "@koa/router";
import productRouter from "./ProductRoutes";
import variantRouter from "./VariantRoutes";
import collectionRouter from "./CollectionRoutes";
import customerRouter from "./CustomerRoutes";
import orderRouter from "./OrderRoutes";

const router = new Router();

router.use('/products', productRouter.routes());
router.use('/variants', variantRouter.routes());
router.use('/collections', collectionRouter.routes());
router.use('/customers', customerRouter.routes());
router.use('/orders', orderRouter.routes());

export default router;