import Router from "@koa/router";
import VariantController from "../controllers/VariantController";

const variantRouter = new Router();
const variantController = new VariantController();

variantRouter.get('/', variantController.getAllVariants);
variantRouter.get('/:id', variantController.getVariantByID);
variantRouter.post('/', variantController.createVariant);
variantRouter.put('/:id', variantController.updateVariant);
variantRouter.delete('/:id', variantController.deleteVariant);

export default variantRouter;