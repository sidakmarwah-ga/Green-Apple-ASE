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
    const { q, page, limit } = ctx.query;
    if (!q) ctx.throw(400, 'Search query required');

    let res;

    const options = {
        where: [
            { tags: Like(`%${q}%`) },
            { title: Like(`%${q}%`) }
        ],
        relations: ['collections', 'variants']
    } as any;

    if (!page && !limit) {
        res = await productRepo.find(options);
    } else if (!page && limit) {
        const lim = Number(limit);
        if (Number.isNaN(lim) || lim < 0) ctx.throw(400, 'Limit must be a number >= 0');
        res = await productRepo.find({
            ...options,
            take: lim
        });
    } else {
        const lim = Number(limit);
        const pg = Number(page);
        if (Number.isNaN(pg) || pg < 1) ctx.throw(400, 'Page must be a number >= 1');
        if (Number.isNaN(lim) || lim < 0) ctx.throw(400, 'Limit must be a number >= 0');
        res = await productRepo.find({
            ...options,
            skip: (pg - 1) * lim,
            take: lim
        });
    }

    ctx.status = 200;
    ctx.body = {
        message: 'Search results fetched successfully',
        results: res
    };
};