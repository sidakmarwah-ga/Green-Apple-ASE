import { Context } from "koa"
import AppDataSource from "../lib/db";
import { Order, OrderStatus } from "../entities/Order";
import { variantRepo } from "./variants.controller";
import { productRepo } from "./product.controller";
import { customerRepo } from "./customers.controller";

export const orderRepo = AppDataSource.getRepository(Order);

export const getAllOrders = async (ctx: Context) => {
    const { page, limit } = ctx.query;
    let res;

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
        }
    } as any;

    if (!page && !limit) {
        res = await orderRepo.find(options);
    } else if (!page && limit) {
        const lim = Number(limit);
        if (Number.isNaN(lim) || lim < 0) ctx.throw(400, 'Limit must be a number >= 0');
        res = await orderRepo.find({
            ...options,
            take: lim
        });
    } else {
        const lim = Number(limit);
        const pg = Number(page);
        if (Number.isNaN(pg) || pg < 1) ctx.throw(400, 'Page must be a number >= 1');
        if (Number.isNaN(lim) || lim < 0) ctx.throw(400, 'Limit must be a number >= 0');
        res = await orderRepo.find({
            ...options,
            skip: (pg - 1) * lim,
            take: lim
        });
    }

    ctx.status = 200;
    ctx.body = {
        message: 'Orders fetched successfully',
        orders: res
    };
};

export const getOrderByID = async (ctx: Context) => {
    const id = ctx.params.id;
    if(!id) ctx.throw(400, 'Order ID required');
    const res = await orderRepo.findOne({
        where: {id},
        relations: ['customer', 'product', 'variant']
    });
    if(!res) ctx.throw(404, 'No Order Found');
    ctx.status = 200;
    ctx.body = {
        message: 'Order fetched successfully',
        order: res
    };
}

export const createOrder = async (ctx: Context) => {
    const {customerId, status, productId, variantId, numberOfUnitsOrdered} : any = ctx.request.body;

    if(!customerId || !productId || !variantId) {
        ctx.status = 400;
        ctx.body = 'Customer ID, Product ID and vairant are required';
        return;
    }

    const variantDetail = await variantRepo.findOne({where: {id: variantId}});
    if(!variantDetail) {
        ctx.throw(404, 'Variant not found');
    }
    
    const prod = await productRepo.exists({where: {id: productId, variants: {
        id: variantId
    }}, relations: ['variants']});

    if(!prod) {
        ctx.throw(404, 'Invalid product or variant');
    }

    const cust = await customerRepo.exists({where: {id: customerId}});

    if(!cust) ctx.throw(404, 'Invalid Customer');

    let num = Number(numberOfUnitsOrdered) || 1;
    if(numberOfUnitsOrdered <= 0) ctx.throw(400, 'number of ordered units must be greater than 0');
    let totalAmount = (num) * variantDetail.price;

    if (status && !Object.values(OrderStatus).includes(status)) {
        ctx.throw(400, "Invalid order status");
    }

    const order = orderRepo.create({
        customer: {id: Number(customerId)},
        status: status ?? OrderStatus.PENDING,
        product: {id: Number(productId)},
        variant: {id: Number(variantId)},
        numberOfUnitsOrdered: num,
        totalAmount
    })

    await orderRepo.save(order);

    ctx.status = 200;
    ctx.body = {
        message: 'Order created successfully',
        order
    };
}

export const updateOrder = async (ctx: Context) => {
    const id = ctx.params.id;
    
    const {customerId, status, productId, variantId, numberOfUnitsOrdered} : any = ctx.request.body;
    
    let prod;
    if(productId) {
        prod = await productRepo.exists({where: {id: productId, variants: {
            id: variantId
        }}, relations: ['variants']});

        if(!prod) {
            ctx.throw(404, 'Invalid product or variant');
        }
    }

    let cust;
    if(customerId) {
        cust = await customerRepo.exists({where: {id: customerId}});
        if(!cust) ctx.throw(404, 'Invalid Customer');
    }
    
    const order = await orderRepo.findOne({
        where: {id},
        relations: ['variant']
    });

    if(!order) ctx.throw(404, 'Order not found');
    
    let variantDetail;
    if(variantId) {
        variantDetail = await variantRepo.findOne({where: {id: variantId}})
        if(!variantDetail) {
            ctx.throw(404, 'Variant not found');
        }
    } else {
        variantDetail = order.variant;
    }

    let totalAmount;
    
    if(numberOfUnitsOrdered) {
        if(numberOfUnitsOrdered <= 0) ctx.throw(400, 'number of ordered units must be greater than 0');
        totalAmount = numberOfUnitsOrdered * variantDetail.price;
    } else {
        totalAmount = order.numberOfUnitsOrdered * variantDetail.price;
    }
    
    if (status && !Object.values(OrderStatus).includes(status)) {
        ctx.throw(400, "Invalid order status");
    }

    order.customer = customerId ?? order.customer;
    order.product = productId ?? order.product;
    order.status = status ?? order.status;
    order.variant = variantId ?? order.variant;
    order.numberOfUnitsOrdered = numberOfUnitsOrdered ?? order.numberOfUnitsOrdered;
    order.totalAmount = totalAmount;

    await orderRepo.save(order);
    ctx.status = 200;
    ctx.body = {
        message: 'Order updated successfully',
        order
    }

}

export const deleteOrder = async (ctx: Context) => {
    const id = ctx.params.id;
    const res = await orderRepo.delete({id});
    ctx.status = 200;
    ctx.body = {
        message: 'Order deleted successfully',
        order: res
    }
}

export const getAllOrdersOfCustmer = async (ctx: Context) => {
    const customerId = ctx.params.customerId;
    if(!customerId) ctx.throw(400, 'Customer ID required');
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
        .where('order.customerId = :customerId', {customerId})
        .getRawMany();
    
    ctx.status = 200;
    ctx.body = {
        res
    }
}