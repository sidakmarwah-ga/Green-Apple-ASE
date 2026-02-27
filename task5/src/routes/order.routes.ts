import Router from "@koa/router";
import * as orderControllers from "../controllers/orders.controller";

const orderRouter = new Router();

orderRouter.get('/', orderControllers.getAllOrders);
orderRouter.get('/:id', orderControllers.getOrderByID);
orderRouter.post('/', orderControllers.createOrder);
orderRouter.put('/:id', orderControllers.updateOrder);
orderRouter.delete('/:id', orderControllers.deleteOrder);
orderRouter.get('/customer/:customerId', orderControllers.getAllOrdersOfCustmer);

export default orderRouter;