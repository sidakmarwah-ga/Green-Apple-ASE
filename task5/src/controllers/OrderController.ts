import { Context } from "koa";
import OrderRepository from "../repositories/OrderRepository";
import BaseController from "./BaseController";
import { takeSkipOptions, validateID, validateNumberOfUnitsOrdered, validateOrderStatus } from "../lib/Utils";
import { Order } from "../entities/Order";
import { DeleteResult } from "typeorm";

export default class OrderController extends BaseController {
  private orderRepo: OrderRepository;

  constructor() {
    super();
    this.orderRepo = new OrderRepository();
  }

  getAllOrders = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const { take, skip } = ctx.query;

        const options = {
          relations: ['customer', 'product', 'variant'],
          select: {
            id: true,
            status: true,
            customer: {
              id: true,
              name: true
            },
            product: {
              id: true,
              title: true
            },
            variant: {
              id: true,
              title: true
            },
            totalAmount: true,
            numberOfUnitsOrdered: true,
            createdAt: true
          },
          ...takeSkipOptions(take, skip)
        } as any;

        const orders = await this.orderRepo.getAllOrders(options);

        const responseBody: any = {
          message: 'Orders fetched successfully',
          orders
        };

        return responseBody;

      }
    );
  }

  getOrderByID = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const order: Order = await this.orderRepo.getOrderByID(id);

        const response = {
          message: 'Order fetched successfully',
          order
        };

        return response;

      }
    );
  }

  createOrder = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const { customerId, productId, variantId, numberOfUnitsOrdered }: any = ctx.request.body;

        validateID(customerId, 'Customer');
        validateID(productId, 'Product');
        validateID(variantId, 'Variant');
        validateNumberOfUnitsOrdered(numberOfUnitsOrdered);

        const order = await this.orderRepo.createOrder({
          customerId, productId, variantId, numberOfUnitsOrdered
        });

        const response = {
          message: 'Order created successfully',
          order
        };

        return response;

      }
    );
  }

  updateOrder = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const { status }: any = ctx.request.body;
        validateOrderStatus(status);

        const updateOrder : Order = await this.orderRepo.updateOrder(
          id, status
        );

        const response = {
          message: 'Order updated successfully',
          updateOrder
        }

        return response;

      }
    );
  }

  deleteOrder = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const deleteResult : DeleteResult = await this.orderRepo.deleteOrder(id);

        const response = {
          message: 'Order deleted successfully',
          deleteResult
        };

        return response;

      }
    );
  }

}