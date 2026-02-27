import Router from "@koa/router";
import * as variantControllers from "../controllers/variants.controller";

const variantRouter = new Router();

variantRouter.get('/', variantControllers.getAllVariants);
variantRouter.get('/:productId', variantControllers.getAllVariantsOfOneProduct);
variantRouter.post('/', variantControllers.createVariant);
variantRouter.put('/:id', variantControllers.updateVariant);
variantRouter.delete('/:id', variantControllers.deleteVariant);

export default variantRouter;