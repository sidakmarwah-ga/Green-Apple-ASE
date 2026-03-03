import { Context } from "koa"
import AppDataSource from "../lib/db";
import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { orderRepo } from "./orders.controller";

export const customerRepo = AppDataSource.getRepository(Customer);

export const getAllCustomers = async (ctx: Context) => {
    const { take, skip } = ctx.query;
    let res;

    if (!take && !skip) {
        res = await customerRepo.find();
    } else if (take && !skip) {
        const tk = Number(skip);
        if(Number.isNaN(tk) || Math.round(tk) !== tk || tk < 1) ctx.throw(400, 'Take must be an Integer >= 1');
        res = await customerRepo.find({
            take: tk
        });
    } else {
        const sk = Number(skip);
        const tk = Number(take);
        if(Number.isNaN(tk) || Math.round(tk) !== tk || tk < 1) ctx.throw(400, 'Take must be an Integer >= 1');
        if(Number.isNaN(sk) || Math.round(sk) !== sk || sk < 0) ctx.throw(400, 'Skip must be an Integer >= 0');
        res = await customerRepo.find({
            skip: sk,
            take: tk
        });
    }

    ctx.status = 200;
    ctx.body = {
        message: 'Customers fetched successfully',
        customers: res
    };
};

export const getCustomerByID = async (ctx: Context) => {
    const id = ctx.params.id;
    if(!id) {
        ctx.throw(404, 'Customer not found;')
    }
    const res = await customerRepo.findOne({where: {id}, relations: ['orders']});
    ctx.status = 200;
    ctx.body = {
        message: 'Customers fetched successfully',
        customers: res
    };
}

export const createCustomer = async (ctx: Context) => {
    const {name, email, phone} : any = ctx.request.body;
    if(!name || !email) {
        ctx.status = 400;
        ctx.body = 'Name and email are required';
        return;
    }

    const cust = customerRepo.create({
        name, email, phone: phone || ""
    });

    await customerRepo.save(cust);

    ctx.status = 200;
    ctx.body = {
        message: 'Customer created successfully',
        customer: cust
    };
}

export const updateCustomer = async (ctx: Context) => {
    const id = ctx.params.id;
    const { name, email, phone } : any = ctx.request.body;
    if(!name || !email) {
        ctx.throw(400, 'Name and Email are required');
    }
    const cust : Customer | null = await customerRepo.findOne({ where: {id: id} });
    if(!cust) {
        ctx.status = 404;
        ctx.body = 'No Product Found';
        return;
    }
    cust.name = name;
    cust.email = email;
    cust.phone = phone || "";
    await customerRepo.save(cust);
    ctx.status = 200;
    ctx.body = {
        message: 'Customer updated successfully',
        customer: cust
    }
}

export const deleteCustomer = async (ctx: Context) => {
    const id = ctx.params.id;
    const res = await customerRepo.delete({id});
    ctx.status = 200;
    ctx.body = {
        message: 'Customer deleted successfully',
        res
    }
}

export const getCustomerTotalAmountSpent = async (ctx: Context) => {
    
    const id = ctx.params.id;
    if(!id) ctx.throw(400, 'Customer ID required');

    const {sum} = await AppDataSource
        .getRepository(Order)
        .createQueryBuilder('order')
        .select("SUM(order.totalAmount)")
        .where("order.customerId = :id", {id})
        .getRawOne();
    ctx.status = 200;
    ctx.body = {
        message: 'Total Amount fetched successfully',
        customerId: Number(id),
        totalAmountSpent: Number(sum) || 0
    }
}

export const getAllOrdersOfCustomer = async (ctx: Context) => {
    const id = ctx.params.id;
    if(!id) ctx.throw(400, 'Customer ID required');
    const res = await orderRepo
        .createQueryBuilder('order')
        .innerJoin('order.product', 'product')
        .innerJoin('order.variant', 'variant')
        .select([
            'order.id',
            'order.productId',
            'order.variantId',
            'product.title',
            'variant.title'
        ])
        .where('order.customerId = :id', {id})
        .getRawMany();
    
    ctx.status = 200;
    ctx.body = {
        res
    }
}