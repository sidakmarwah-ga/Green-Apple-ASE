import { Context } from "koa"
import { Product } from "../entities/Product";
import AppDataSource from "../lib/db";
import { collectionRepo } from "./collection.controller";
import { In } from "typeorm";
import { Order } from "../entities/Order";

export const productRepo = AppDataSource.getRepository(Product);

export const getAllProducts = async (ctx: Context) => {
    const {take, skip, fields} = ctx.query;

    if(Array.isArray(fields)) 
        ctx.throw(400, 'fields query value must be a string containing comma seperated names of fields.');

    const currentFields = productRepo.metadata.propertiesMap;

    const options : any = {};
    const invalidFields : string[] = [];
    options.select = fields?.split(',')
        .filter(it => {
            const isthere = it in currentFields;
            if(!isthere) invalidFields.push(it);
            return isthere;
        });
    
    let products;
    if(!take && !skip) {
        products = await productRepo.find({
            ...options
        });
    } else if(take && !skip) {
        const tk = Number(take);
        if(Number.isNaN(tk) || Math.round(tk) !== tk || tk < 1) ctx.throw(400, 'Take must be an Integer >= 1');
        products = await productRepo.find({
            take: tk,
            ...options
        });
    } else {
        const sk = Number(skip);
        const tk = Number(take);
        if(Number.isNaN(tk) || Math.round(tk) !== tk || tk < 1) ctx.throw(400, 'Take must be an Integer >= 1');
        if(Number.isNaN(sk) || Math.round(sk) !== sk || sk < 0) ctx.throw(400, 'Skip must be an Integer >= 0');
        products = await productRepo.find({
            skip: sk,
            take: tk,
            ...options
        });
    }

    ctx.status = 200;
    const responseBody: any = {
        message: 'Products fetched successfully',
        products
    };
    if(invalidFields.length !== 0) {
        responseBody.message = 'Products fetched, invalid fields ignored.';
    }
    ctx.body = responseBody;
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