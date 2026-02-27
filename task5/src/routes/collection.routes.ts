import Router from "@koa/router";
import * as collectionControllers from "../controllers/collection.controller";

const collectionRouter = new Router();

collectionRouter.get('/', collectionControllers.getAllCollections);
collectionRouter.get('/:id', collectionControllers.getAllProductsOfCollection);
collectionRouter.post('/', collectionControllers.createCollection);
collectionRouter.put('/:id', collectionControllers.updateCollection);
collectionRouter.delete('/:id', collectionControllers.deleteCollection);
collectionRouter.put('/:id/products', collectionControllers.addMultipleProductsInOneCollection);

export default collectionRouter;