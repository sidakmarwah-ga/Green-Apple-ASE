import { Context } from "koa"
import AppDataSource from "../lib/db";
import { Collection } from "../entities/Collection";
import { productRepo } from "./product.controller";
import { In } from "typeorm";

export const collectionRepo = AppDataSource.getRepository(Collection);

export const getAllCollections = async (ctx: Context) => {
    const res = await collectionRepo.find();
    ctx.status = 200;
    ctx.body = {
        message: 'Collections fetched successfully',
        collections: res
    };
}

export const getAllProductsOfCollection = async (ctx: Context) => {
    const id = ctx.params.id;
    if(!id) {
        ctx.status = 400;
        ctx.body = {
            message: 'Collection ID is required'
        };
        return;
    }
    const collection = await collectionRepo.findOne({where: {id}});
    if(!collection) {
        ctx.throw(404, 'Collection not found');
    }
    const prods = await productRepo.find({where: {collections: {id}} });
    ctx.status = 200;
    ctx.body = {
        message: 'Products of the collection fetched successfully',
        collection,
        products: prods
    };
}

export const createCollection = async (ctx: Context) => {
    const {title} : any = ctx.request.body;

    if(!title) {
        ctx.status = 400;
        ctx.body = 'Collection title is required';
        return;
    }

    const collection = collectionRepo.create({
        title
    })

    await collectionRepo.save(collection);

    ctx.status = 200;
    ctx.body = {
        message: 'Collection created successfully',
        collection
    };
}

export const updateCollection = async (ctx: Context) => {
    const id = ctx.params.id;
    const {title} : any = ctx.request.body;
    
    const collection : Collection | null = await collectionRepo.findOne({ where: {id} });
    if(!collection) {
        ctx.status = 404;
        ctx.body = 'No Collection Found';
        return;
    }
    if(!collection.title || collection.title === "") {
        ctx.status = 400;
        ctx.body = 'Title Required';
    }
    collection.title = title;
    await collectionRepo.save(collection);
    ctx.status = 200;
    ctx.body = {
        message: 'Collection updated successfully',
        collection
    }
}

export const deleteCollection = async (ctx: Context) => {
    const id = ctx.params.id;
    const res = await collectionRepo.delete({id});
    ctx.status = 200;
    ctx.body = {
        message: 'Collection deleted successfully',
        res
    }
}

export const addMultipleProductsInOneCollection = async (ctx: Context) => {
    const id = ctx.params.id;
    const {productIDs} : any = ctx.request.body;

    if(!id) {
        ctx.throw(400, 'Collection ID required');
    }

    const collection = await collectionRepo.findOne({where: {id}, relations:['products']});

    if(!collection) {
        ctx.throw(404, 'Invalid Product ID');
    }

    const products = await productRepo.find({where: {id: In(productIDs || [])}});

    if(!products) {
        ctx.throw(400, 'Product IDs are required');
    }

    collection.products = products;

    await collectionRepo.save(collection);

    ctx.status = 200;
    ctx.body = {
        message: 'Products added to the collection successfully',
        collection
    }
}