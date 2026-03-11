import { Context } from "koa";
import CustomerRepository from "../repositories/CustomerRepository";
import BaseController from "./BaseController";
import { takeSkipOptions, validateEmail, validateID, validateName, validatePhone } from "../lib/Utils";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";
import { UpdateResult } from "typeorm";
import { Order } from "../entities/Order";

export default class CustomerController extends BaseController {

  private customerRepo: CustomerRepository;

  constructor() {
    super();
    this.customerRepo = new CustomerRepository();
  }

  getAllCustomers = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {
        const { take, skip } = ctx.query;

        const options = {
          ...takeSkipOptions(take, skip)
        };

        const customers = await this.customerRepo.getAllCustomers(options);

        const responseBody: any = {
          message: 'Customers fetched successfully',
          customers
        };

        return responseBody;
      }
    );
  }

  getCustomerByID = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {
        const id = ctx.params.id;
        validateID(id);

        const collection = await this.customerRepo.getCustomerByID(id);

        const response = {
          message: 'Customer fetched successfully',
          collection
        }

        return response;
      }
    );
  }

  createCustomer = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {
        const { name, email, phone }: any = ctx.request.body;

        validateName(name);
        validateEmail(email);
        validatePhone(phone);

        const customer = await this.customerRepo.createCustomer({
          name, email, phone: phone ?? ''
        });

        const response = {
          message: 'Customer created successfully',
          customer
        };

        return response;
      }
    );
  }

  updateCustomer = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const { name, email, phone }: any = ctx.request.body;

        validateName(name);
        validateEmail(email);
        validatePhone(phone);

        const updateResult: UpdateResult = await this.customerRepo.updateCustomer(id, {
          name, email, phone: phone ?? ''
        });

        const response = {
          message: 'Customer updated successfully',
          updateResult
        };

        return response;
      }
    );
  }

  deleteCustomer = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const deleteReselt = await this.customerRepo.deleteCustomer(id);

        const response = {
          message: 'Customer deleted successfully',
          deleteReselt
        };

        return response;

      }
    );
  }

  getCustomerTotalAmountSpent = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const amounts: Order[] = await this.customerRepo.getCustomerOrderAmounts(id);

        let sum = 0;
        amounts.forEach(order => {
          sum += order.totalAmount;
        });

        const response = {
          message: 'Total Amount fetched successfully',
          customerId: Number(id),
          totalAmountSpent: sum
        };

        return response;

      }
    );
  }

  getAllOrdersOfCustomer = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const orders = await this.customerRepo.getAllOrdersOfCustomer(id);

        const response = {
          message: 'Orders of Customer fetched successfully',
          customerId: Number(id),
          orders
        };

        return response;

      }
    );
  }

}