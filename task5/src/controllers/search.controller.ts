import { Context } from "koa";
import { productRepo } from "./product.controller";
import { Like } from "typeorm";

export const searchFunciton = async (ctx: Context) => {
    const {q} = ctx.query;
    if(!q) ctx.throw(400, 'Search query required');
    const res = await productRepo
        .createQueryBuilder('product')
        .where('product.tags LIKE :q OR product.title LIKE :q', {
            q: `%${q}%`
        }).getRawMany();

    ctx.status = 200;
    ctx.body = {
        message: 'Search results fetched successfully',
        results: res
    }
}

export const searchFunciton2 = async (ctx: Context) => {
    const { q, skip, take } = ctx.query;
    if (!q) ctx.throw(400, 'Search query required');

    let res;

    const options = {
        where: [
            { tags: Like(`%${q}%`) },
            { title: Like(`%${q}%`) }
        ],
        relations: ['collections', 'variants']
    } as any;

    if (!skip && !take) {
        res = await productRepo.find(options);
    } else if (!skip && take) {
        const tk = Number(take);
        if(Number.isNaN(tk) || Math.round(tk) !== tk || tk < 1) ctx.throw(400, 'Take must be an Integer >= 1');
        res = await productRepo.find({
            ...options,
            take: tk
        });
    } else {
        const tk = Number(take);
        const sk = Number(skip);
        if(Number.isNaN(tk) || Math.round(tk) !== tk || tk < 1) ctx.throw(400, 'Take must be an Integer >= 1');
        if(Number.isNaN(sk) || Math.round(sk) !== sk || sk < 0) ctx.throw(400, 'Skip must be an Integer >= 0');
        res = await productRepo.find({
            ...options,
            skip: sk,
            take: tk
        });
    }

    ctx.status = 200;
    ctx.body = {
        message: 'Search results fetched successfully',
        results: res
    };
};