import Router from "@koa/router";
import OrderController from "../controllers/OrderController";

const orderRouter = new Router();
const orderController = new OrderController();

orderRouter.get('/', orderController.getAllOrders);
orderRouter.get('/:id', orderController.getOrderByID);
orderRouter.post('/', orderController.createOrder);
orderRouter.put('/:id', orderController.updateOrder);
orderRouter.delete('/:id', orderController.deleteOrder);

export default orderRouter;