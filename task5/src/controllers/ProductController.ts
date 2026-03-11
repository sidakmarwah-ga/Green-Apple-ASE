import { Context } from "koa";
import BaseController from "./BaseController";
import { takeSkipOptions, validateAddRemoveArray, validateID } from "../lib/Utils";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";
import ProductRepository from "../repositories/ProductRepository";
import { DeleteResult, Like, UpdateResult } from "typeorm";
import { Product } from "../entities/Product";

export default class ProductController extends BaseController {

  private productRepo: ProductRepository;

  constructor() {
    super();
    this.productRepo = new ProductRepository();
  }

  getAllProducts = async (ctx: Context) => {
    return BaseController.execute(
      ctx,
      async () => {

        const { take, skip, fields, query } = ctx.query;

        if (Array.isArray(fields)) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            'fields query value must be a string containing comma seperated names of fields.'
          )
        }

        const currentFields = this.productRepo.getCurrentFields();

        let options: any = {};
        const invalidFields: string[] = [];
        options.select = fields?.split(',')
          .filter((it: string) => {
            const isthere = it in currentFields;
            if (!isthere) invalidFields.push(it);
            return isthere;
          });

        options = {
          ...options,
          ...takeSkipOptions(take, skip)
        };

        if(query) {

          if(typeof query !== 'string') {
            throw new AppError(
              HTTP_STATUS.BAD_REQUEST,
              'If query parameter is to be sent, it should of String Type'
            );
          }
          
          options['where'] = [
            { title: Like(`%${query}%`) },
            { tags: Like(`%${query}%`) }
          ];
        }

        const products = await this.productRepo.getAllProducts(options);

        const responseBody: any = {
          message: 'Products fetched successfully',
          products
        };
        if (invalidFields.length !== 0) {
          responseBody.message = 'Products fetched, invalid fields ignored.';
        }

        return responseBody;

      }
    );
  }

  getProductByID = async (ctx: Context) => {
    return BaseController.execute(
      ctx,
      async () => {
        const id = ctx.params.id;

        validateID(id);

        const product = await this.productRepo.getProductByID(id);

        return {
          message: 'Product found successfully',
          product
        }
      }
    );
  }

  createProduct = async (ctx: Context) => {

    return BaseController.execute(
      ctx,
      async () => {
        const { title, description, tags } = ctx.request.body as any;

        if (!title) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            'Product title required'
          );
        }

        const product = await this.productRepo.createProduct({
          title,
          description: description ?? "",
          tags: tags ?? []
        });

        return {
          message: 'Product created successfully',
          product
        }
      }
    );

  }

  updateProduct = async (ctx: Context) => {
    return BaseController.execute(
      ctx,
      async () => {
        const id = ctx.params.id;

        validateID(id);

        const { title, description, tags }: any = ctx.request.body;

        if (!title && !description && !tags) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            'Update values are not defined'
          );
        }

        if (title && typeof title !== "string"
          || description && typeof description !== "string"
          || tags && !Array.isArray(tags)
        ) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            'Tags should be an array containing tag words'
          );
        }

        if (title === "") {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            'Title can not be empty'
          );
        }

        const data: any = {};

        if (title) data['title'] = title;
        if (description) data['description'] = description;
        if (tags) data['tags'] = tags;

        const updateResult: UpdateResult = await this.productRepo.updateProduct(id, data);

        return {
          message: 'Product updated successfully',
          updateResult
        }

      }
    );
  }

  deleteProduct = async (ctx: Context) => {
    return BaseController.execute(
      ctx,
      async () => {
        const id = ctx.params.id;

        validateID(id);

        const deleteResult: DeleteResult = await this.productRepo.deleteProduct(id);

        return {
          message: 'Product deleted successfully',
          deleteResult
        }

      }
    );
  }

  updateProductCollections = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;

        validateID(id);

        const { toAdd, toRemove } = ctx.request.body as any;

        validateAddRemoveArray(toAdd, toRemove);

        const product: Product = await this.productRepo.updateProductCollections(id, toAdd ?? [], toRemove ?? []);

        return {
          message: 'Product Collections updated successfully',
          product
        }

      }
    );
  }

  numberOfSales = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const orders = await this.productRepo.numberOfSalesOfProduct(id);

        let sum = 0;
        orders.forEach(order => {
          sum += order.numberOfUnitsOrdered;
        });

        const response = {
          message: 'Number of sales of a product fetched successfully',
          numberOfSales: sum
        };

        return response;

      }
    );
  }

}