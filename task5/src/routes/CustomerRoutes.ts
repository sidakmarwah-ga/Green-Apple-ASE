import Router from "@koa/router";
import CustomerController from "../controllers/CustomerController";

const customerRouter = new Router();
const customerController = new CustomerController();

customerRouter.get('/', customerController.getAllCustomers);
customerRouter.get('/:id', customerController.getCustomerByID);
customerRouter.get('/:id/amount', customerController.getCustomerTotalAmountSpent);
customerRouter.post('/', customerController.createCustomer);
customerRouter.put('/:id', customerController.updateCustomer);
customerRouter.delete('/:id', customerController.deleteCustomer);
customerRouter.get('/:id/orders', customerController.getAllOrdersOfCustomer);

export default customerRouter;