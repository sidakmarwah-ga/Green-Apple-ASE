import { Context } from "koa"
import { Product } from "../entities/Product";
import AppDataSource from "../lib/db";
import { collectionRepo } from "./collection.controller";
import { In } from "typeorm";
import { Order } from "../entities/Order";

export const productRepo = AppDataSource.getRepository(Product);

export const getAllProducts = async (ctx: Context) => {
    const {page, limit} = ctx.query;
    let res;
    if(!page && !limit) {
        res = await productRepo.find({
            relations: ["collections", "variants"]
        });
    } else if(!page && limit) {
        const lim = Number(limit);
        if(lim)
        if(Number.isNaN(lim) || lim < 0) ctx.throw(400, 'Limit must be a number >= 0');
        res = await productRepo.find({
            take: lim,
            relations: ["collections", "variants"]
        });
    } else {
        const lim = Number(limit);
        const pg = Number(page);
        if(Number.isNaN(pg) || pg < 1) ctx.throw(400, 'Page must be a number >= 1');
        if(Number.isNaN(lim) || lim < 0) ctx.throw(400, 'Limit must be a number >= 0');
        res = await productRepo.find({
            skip: (pg - 1) * lim,
            take: lim,
            relations: ["collections", "variants"]
        });
    }
    ctx.status = 200;
    ctx.body = {
        message: 'Products fetched successfully',
        products: res
    };
}

export const getProductById = async (ctx : Context) => {
    const id = ctx.params.id;
    if(!id) {
        ctx.throw(400, 'Product ID is required');
    }
    const prod = await productRepo.findOne({where: {id}, relations: ['collections', 'variants'] });
    
    if(!prod) {
        ctx.throw(404, 'Product not found');
    }

    ctx.status = 200;
    ctx.body = {
        message: 'Product found successfully',
        product: prod
    }

}

export const createProduct = async (ctx: Context) => {
    const {title, description, tags} : any = ctx.request.body;
    if(!title) {
        ctx.status = 400;
        ctx.body = 'Product title required';
        return;
    }

    const prod = productRepo.create({
        title, description: description || "", tags: tags || []
    });

    await productRepo.save(prod);

    ctx.status = 200;
    ctx.body = {
        message: 'Product created successfully',
        product: prod
    };
}

export const updateProduct = async (ctx: Context) => {
    const id = ctx.params.id;
    const {title, description, tags, collections, variants} : any = ctx.request.body;
    const prod : Product | null = await productRepo.findOne({ where: {id: id} });
    if(!prod) {
        ctx.status = 404;
        ctx.body = 'No Product Found';
        return;
    }
    if(!title || title === "") {
        ctx.status = 400;
        ctx.body = 'Title Required';
    }
    prod.title = title;
    prod.description = description || "";
    prod.tags = tags || [];
    prod.collections = collections || [];
    prod.variants = variants || [];
    await productRepo.save(prod);
    ctx.status = 200;
    ctx.body = {
        message: 'Product updated successfully',
        product: prod
    }
}

export const deleteProduct = async (ctx: Context) => {
    const id = ctx.params.id;
    const res = await productRepo.delete({id});
    ctx.status = 200;
    ctx.body = {
        message: 'Product deleted successfully',
        res
    }
}

export const addOneProductToMultipleCollections = async (ctx: Context) => {
    const id = ctx.params.id;
    const {collectionIDs} : any = ctx.request.body;

    if(!id) {
        ctx.throw(400, 'Product ID required');
    }

    const prod = await productRepo.findOne({where: {id}, relations:['collections']});

    if(!prod) {
        ctx.throw(404, 'Invalid Product ID');
    }

    const collections = await collectionRepo.find({where: {id: In(collectionIDs || [])}});

    if(!collections) {
        ctx.throw(400, 'Collection IDs are required');
    }

    prod.collections = collections;

    await productRepo.save(prod);

    ctx.status = 200;
    ctx.body = {
        message: 'Product added to collections successfully',
        product: prod
    }

}

export const numberOfSales = async (ctx: Context) => {
    const id = ctx.params.id;
    if(!id) {
        ctx.throw(400, 'Product ID required');
    }

    const {sum} = await AppDataSource
        .getRepository(Order)
        .createQueryBuilder('order')
        .select("SUM(order.numberOfUnitsOrdered)")
        .where("order.productId = :id", {id})
        .getRawOne();
        
    ctx.status = 200;
    ctx.body = {
        message: 'Number of Sales fetched successfully',
        productId: id,
        numberOfSales: Number(sum) || 0
    }
}