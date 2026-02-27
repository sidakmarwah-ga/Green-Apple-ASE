import Router from "@koa/router";
import * as customerControllers from "../controllers/customers.controller";

const customerRouter = new Router();

customerRouter.get('/', customerControllers.getAllCustomers);
customerRouter.get('/:id', customerControllers.getCustomerByID);
customerRouter.get('/:id/amount', customerControllers.getCustomerTotalAmountSpent);
customerRouter.post('/', customerControllers.createCustomer);
customerRouter.put('/:id', customerControllers.updateCustomer);
customerRouter.delete('/:id', customerControllers.deleteCustomer);

export default customerRouter;