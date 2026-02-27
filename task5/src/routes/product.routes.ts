import Router from "@koa/router";
import * as productControllers from "../controllers/product.controller";

const productRouter = new Router();

productRouter.get('/', productControllers.getAllProducts);
productRouter.get('/:id', productControllers.getProductById);
productRouter.post('/', productControllers.createProduct);
productRouter.put('/:id', productControllers.updateProduct);
productRouter.delete('/:id', productControllers.deleteProduct);
productRouter.put('/:id/collections', productControllers.addOneProductToMultipleCollections);
productRouter.get('/:id/sales', productControllers.numberOfSales);

export default productRouter;