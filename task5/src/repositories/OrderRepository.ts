import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Order } from "../entities/Order";
import AppDataSource from "../lib/DB";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";
import VariantRepository from "./VariantRepository";
import ProductRepository from "./ProductRepository";
import CustomerRepository from "./CustomerRepository";
import { OrderStatus } from "../lib/Types";
import { validateOrderStatusUpdateTransition } from "../lib/Utils";

export default class OrderRepository {

  private orderRepo: Repository<Order>;

  constructor() {
    this.orderRepo = AppDataSource.getRepository(Order);
  }

  getAllOrders = async (options?: any): Promise<Order[]> => {
    const orders: Order[] = await this.orderRepo.find({
      ...options
    });
    return orders;
  }

  getOrderByID = async (id: number): Promise<Order> => {

    const order: Order | null = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'product', 'variant']
    });

    if (!order) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Order not found'
      );
    }

    return order;

  }

  createOrder = async (data: any) => {
    const { customerId, productId, variantId, numberOfUnitsOrdered }: any = data;

    const variantRepo = new VariantRepository();
    const variant = await variantRepo.getVariantByID(variantId);

    if(variant.stock === 0) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Product Variant Out of stock.'
      );
    }

    const productRepo = new ProductRepository();
    const productFound = await productRepo.checkIfProductExist({
      where: {
        id: productId,
        variants: {
          id: variantId
        }
      },
      relations: ['variants']
    });

    if(!productFound) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Invalid Product or Variant'
      );
    }

    const customerRepo = new CustomerRepository();
    const customerFound = await customerRepo.checkIfCustomerExist({
      where: {
        id: customerId
      }
    });

    if(!customerFound) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Invalid Customer'
      );
    }

    if(variant.stock < numberOfUnitsOrdered) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Stock not available, try decreasing the number of units.'
      );
    }

    let totalAmount = numberOfUnitsOrdered * variant.price;

    const order = this.orderRepo.create({
      customer: {id: customerId},
      status: OrderStatus.PENDING,
      product: {id: productId},
      variant: {id: variantId},
      numberOfUnitsOrdered,
      totalAmount
    });

    await this.orderRepo.save(order);

    await variantRepo.updateVariant(variantId, {
      stock: variant.stock - numberOfUnitsOrdered
    });

    return order;

  }

  updateOrder = async (id: number, status: OrderStatus): Promise<Order> => {
    
    const order: Order = await this.getOrderByID(id);

    validateOrderStatusUpdateTransition(
      status,
      order.status
    );

    if(status === OrderStatus.RETURNED) {
      const variantID = order.variant.id;
      const variantRepo = new VariantRepository();
      const variant = await variantRepo.getVariantByID(variantID);
      await variantRepo.updateVariant(variantID, {
        stock: variant.stock + order.numberOfUnitsOrdered
      });
      // order.totalAmount = 0;
    }

    order.status = status;
    await this.orderRepo.save(order);

    return order;

  }

  deleteOrder = async (id: number): Promise<DeleteResult> => {
    const deleteResult : DeleteResult = await this.orderRepo.delete({id});
    if(deleteResult.affected === 0) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Order not found'
      );
    }
    return deleteResult;
  }

}