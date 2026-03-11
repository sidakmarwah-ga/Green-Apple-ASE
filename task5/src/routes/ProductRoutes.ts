import Router from "@koa/router";
import ProductController from "../controllers/ProductController";

const productRouter = new Router();
const productController = new ProductController();

productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getProductByID);
productRouter.post('/', productController.createProduct);
productRouter.put('/:id', productController.updateProduct);
productRouter.delete('/:id', productController.deleteProduct);
productRouter.put('/:id/collections', productController.updateProductCollections);
productRouter.get('/:id/sales', productController.numberOfSales);

export default productRouter;