import { DeleteResult, Not, Repository, UpdateResult } from "typeorm";
import { Customer } from "../entities/Customer";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";
import AppDataSource from "../lib/DB";
import { Order } from "../entities/Order";
import OrderRepository from "./OrderRepository";
import { OrderStatus } from "../lib/Types";

export default class CustomerRepository {

  private curstomerRepo : Repository<Customer>;

  constructor() {
    this.curstomerRepo = AppDataSource.getRepository(Customer);
  }

  getAllCustomers = async (options?: any) : Promise<Customer[]> => {
    const customers : Customer[] = await this.curstomerRepo.find({
      ...options
    });
    return customers;
  }

  getCustomerByID = async (id: number) : Promise<Customer> => {

    const customer : Customer | null = await this.curstomerRepo.findOne({where: {id}});

    if(!customer) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Customer not found'
      );
    }

    return customer;

  }

  checkIfCustomerExist = async (options: any): Promise<boolean> => {
		return await this.curstomerRepo.exists({
			...options
		});
	}

  createCustomer = async (data : any) : Promise<Customer> => {

    const {name, email, phone} : any = data;

    const customer = this.curstomerRepo.create({
      name, email, phone
    });

    await this.curstomerRepo.save(customer);

    return customer;

  }

  updateCustomer = async (id : number, data : any) : Promise<UpdateResult> => {
		const { name, email, phone } : any = data;

    const isEmailNotUnique : boolean = await this.curstomerRepo.exists({
      where: {email}
    });

    if(isEmailNotUnique) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Customer exists with this email'
      );
    }

		const updateResult : UpdateResult = await this.curstomerRepo.update(id, {
      name, email, phone
    });

    if(updateResult.affected === 0) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Customer not found'
      );
    }

    return updateResult;
    
	}

  deleteCustomer = async (id: number) : Promise<DeleteResult> => {
    const deleteReselt = await this.curstomerRepo.delete({id});

    if(deleteReselt.affected === 0) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Customer not found'
      );
    }

    return deleteReselt;
  }

  getCustomerOrderAmounts = async (id: number) : Promise<Order[]> => {

    const isCustomer : boolean = await this.curstomerRepo.exists({ where: {id} });

    if(!isCustomer) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Customer not found'
      );
    }

    const orderRepo = new OrderRepository();

    const amounts : Order[] = await orderRepo.getAllOrders({
      where: {customer: {id}, status: Not(OrderStatus.RETURNED)},
      select: ['totalAmount']
    });

    return amounts;
  }

  getAllOrdersOfCustomer = async (id : number) : Promise<Order[]> => {

    const isCustomer : boolean = await this.curstomerRepo.exists({ where: {id} });

    if(!isCustomer) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Customer not found'
      );
    }

    const orderRepo = new OrderRepository();

    const orders = await orderRepo.getAllOrders({
      where: {
        customer: {id}
      },
      select: {
        id: true,
        product: {
          id: true,
          title: true,
        },
        variant: {
          id: true,
          title: true
        }
      },
      relations: ['product', 'variant']
    });

    return orders;

  }

}