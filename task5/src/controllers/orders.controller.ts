import { Context } from "koa"
import AppDataSource from "../lib/db";
import { Order, OrderStatus } from "../entities/Order";
import { variantRepo } from "./variants.controller";
import { productRepo } from "./product.controller";
import { customerRepo } from "./customers.controller";

export const orderRepo = AppDataSource.getRepository(Order);

export const getAllOrders = async (ctx: Context) => {
    const { skip, take } = ctx.query;
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

    if (!skip && !take) {
        res = await orderRepo.find(options);
    } else if (!skip && take) {
        const tk = Number(take);
        if(Number.isNaN(tk) || Math.round(tk) !== tk || tk < 1) ctx.throw(400, 'Take must be an Integer >= 1');
        res = await orderRepo.find({
            ...options,
            take: tk
        });
    } else {
        const tk = Number(take);
        const sk = Number(skip);
        if(Number.isNaN(tk) || Math.round(tk) !== tk || tk < 1) ctx.throw(400, 'Take must be an Integer >= 1');
        if(Number.isNaN(sk) || Math.round(sk) !== sk || sk < 0) ctx.throw(400, 'Skip must be an Integer >= 0');
        res = await orderRepo.find({
            ...options,
            skip: sk,
            take: tk
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
    const {customerId, productId, variantId, numberOfUnitsOrdered} : any = ctx.request.body;

    if(!customerId || !productId || !variantId) {
        ctx.status = 400;
        ctx.body = 'Customer ID, Product ID and vairant are required';
        return;
    }

    const variantDetail = await variantRepo.findOne({where: {id: variantId}});
    if(!variantDetail) {
        ctx.throw(404, 'Variant not found');
    }

    if(variantDetail.stock === 0) {
        ctx.throw(404, 'Product Variant Out of stock.')
    }
    
    const prod = await productRepo.exists({where: {id: productId, variants: {
        id: variantId
    }}, relations: ['variants']});

    if(!prod) {
        ctx.throw(404, 'Invalid product or variant');
    }

    const cust = await customerRepo.exists({where: {id: customerId}});

    if(!cust) ctx.throw(404, 'Invalid Customer');

    let num = Number(numberOfUnitsOrdered);
    if(Number.isNaN(num) || Math.round(num) !== num || num <= 1) 
        ctx.throw(400, 'Number of ordered units must be an Integer greater than or equal to 1');

    if(variantDetail.stock < num) {
        ctx.status = 200;
        ctx.body = {
            message: 'Stock not available, try decreasing the number of units.'
        }
    }

    let totalAmount = (num) * variantDetail.price;

    const order = orderRepo.create({
        customer: {id: Number(customerId)},
        status: OrderStatus.PENDING,
        product: {id: Number(productId)},
        variant: {id: Number(variantId)},
        numberOfUnitsOrdered: num,
        totalAmount
    })

    await orderRepo.save(order);

    variantDetail.stock -= num;

    await variantRepo.save(variantDetail);

    ctx.status = 200;
    ctx.body = {
        message: 'Order created successfully',
        order
    };
}

export const updateOrder = async (ctx: Context) => {
    const id = ctx.params.id;
    
    const {status} : any = ctx.request.body;

    if(!status) ctx.throw(400, 'Status is required');
    
    const order = await orderRepo.findOne({
        where: {id},
        relations: ['variant']
    });

    if(!order) ctx.throw(404, 'Order not found');

    if(order.status === OrderStatus.CANCELLED) {
        ctx.throw(400, 'Cancelled order states can not be changed');
    }
    
    if(order.status === OrderStatus.RETURNED) {
        ctx.throw(400, 'Returned order states can not be changed');
    }
    
    if (status && !Object.values(OrderStatus).includes(status)) {
        ctx.throw(400, "Invalid order status");
    }

    if(status === OrderStatus.CANCELLED && order.status === OrderStatus.COMPLETE) {
        ctx.throw(400, 'Completed orders can not be cancelled');
    }
    
    if(status == OrderStatus.RETURNED) {
        if(order.status !== OrderStatus.COMPLETE) {
            ctx.throw(400, 'Order can not be returned before completion of order.');
        }

        const variant = await variantRepo.findOne({where: {
            id: order.variant.id
        }});

        if(!variant) ctx.throw(400, 'Invalid Variant');
        
        variant.stock++;

        variantRepo.save(variant);

    }

    order.status = status;
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