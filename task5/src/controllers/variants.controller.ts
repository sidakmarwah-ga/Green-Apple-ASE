import { Context } from "koa"
import AppDataSource from "../lib/db";
import { Variant } from "../entities/Variant";
import { productRepo } from "./product.controller";

export const variantRepo = AppDataSource.getRepository(Variant);

export const getAllVariants = async (ctx: Context) => {
    const res = await variantRepo.find();
    ctx.status = 200;
    ctx.body = {
        message: 'Variants fetched successfully',
        variants: res
    };
}

export const getAllVariantsOfOneProduct = async (ctx: Context) => {
    const productId = ctx.params.productId;
    const res = await variantRepo.find({where: {product: {
        id: productId
    }}});
    ctx.status = 200;
    ctx.body = {
        message: 'Variants fetched successfully',
        variants: res
    };
}

export const createVariant = async (ctx: Context) => {
    const {title, productId, sku, price, stock, attributes} : any = ctx.request.body;
    if(!title || !productId) {
        ctx.status = 400;
        ctx.body = 'Variant title and product ID required';
        return;
    }
    if(!stock) {
        ctx.status = 400;
        ctx.body = 'Stock required with value greater than 0';
        return;
    }

    const oldVariant = await variantRepo.exists({where: {sku}});

    if(oldVariant) {
        ctx.status = 404;
        ctx.body = 'a variant already exists with same sku';
        return;
    }

    const prod = await productRepo.exists({where: {id: productId}});

    if(!prod) {
        ctx.status = 404;
        ctx.body = 'Invalid product id';
        return;
    }

    const variant = variantRepo.create({
        title,
        product: {
            id: productId
        },
        sku,
        price,
        stock,
        attributes
    })

    await variantRepo.save(variant);

    ctx.status = 200;
    ctx.body = {
        message: 'Variant created successfully',
        variant
    };
}

export const updateVariant = async (ctx: Context) => {
    const id = ctx.params.id;
    const {title, sku, price, stock, attributes} : any = ctx.request.body;
    
    const variant : Variant | null = await variantRepo.findOne({ where: {id} });
    if(!variant) {
        ctx.status = 404;
        ctx.body = 'No variant Found';
        return;
    }
    if(!variant.title || variant.title === "") {
        ctx.status = 400;
        ctx.body = 'Title Required';
    }
    variant.title = title;
    variant.sku = sku;
    variant.price = price;
    variant.stock = stock;
    variant.attributes = attributes;
    await variantRepo.save(variant);
    ctx.status = 200;
    ctx.body = {
        message: 'Variant updated successfully',
        variant
    }
}

export const deleteVariant = async (ctx: Context) => {
    const id = ctx.params.id;
    const res = await variantRepo.delete({id});
    ctx.status = 200;
    ctx.body = {
        message: 'Variant deleted successfully',
        res
    }
}