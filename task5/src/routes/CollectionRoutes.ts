import Router from "@koa/router";
import CollectionController from "../controllers/CollectionController";

const collectionRouter = new Router();

const collectionController = new CollectionController();

collectionRouter.get('/', collectionController.getAllCollections);
collectionRouter.get('/:id', collectionController.getCollectionByID);
collectionRouter.post('/', collectionController.createCollection);
collectionRouter.put('/:id', collectionController.updateCollection);
collectionRouter.delete('/:id', collectionController.deleteCollection);
collectionRouter.put('/:id/products', collectionController.updateCollectionProducts);

export default collectionRouter;