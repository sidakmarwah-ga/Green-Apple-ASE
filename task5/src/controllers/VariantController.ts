import { Context } from "koa";
import VariantRepository from "../repositories/VariantRepository"
import BaseController from "./BaseController"
import { takeSkipOptions, validateAttributes, validateID, validatePrice, validateSKU, validateStock, validateTitle } from "../lib/Utils";
import { Variant } from "../entities/Variant";
import { UpdateResult } from "typeorm";

export default class VariantController extends BaseController {
  private variantRepo: VariantRepository;

  constructor() {
    super();
    this.variantRepo = new VariantRepository();
  }

  getAllVariants = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {
        const { take, skip } = ctx.query;

        const options = {
          ...takeSkipOptions(take, skip)
        };

        const variants = await this.variantRepo.getAllVariants(options);

        const responseBody: any = {
          message: 'Variants fetched successfully',
          variants
        };

        return responseBody;
      }
    );
  }

  getVariantByID = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {
        const id = ctx.params.id;
        validateID(id);

        const variant = await this.variantRepo.getVariantByID(id);

        const response = {
          message: 'Variant fetched successfully',
          variant
        }

        return response;
      }
    );
  }

  createVariant = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const {
          title,
          productID,
          sku,
          price,
          stock,
          attributes
        }: any = ctx.request.body;

        validateTitle(title);
        validateID(productID);
        validateSKU(sku);
        validatePrice(price);
        validateStock(stock);
        validateAttributes(attributes);

        const variant: Variant = await this.variantRepo.createVariant({
          title,
          productID,
          sku,
          price,
          stock,
          attributes
        });

        const response = {
          message: 'Variant created successfully',
          variant
        }

        return response;

      }
    );
  }

  updateVariant = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const {title, sku, price, stock, attributes} : any = ctx.request.body;

        if(title) validateTitle(title);
        if(sku) validateSKU(sku);
        if(price) validatePrice(price);
        if(stock) validateStock(stock);
        if(attributes) validateAttributes(attributes);

        const updateResult: UpdateResult = await this.variantRepo.updateVariant(id, {
          title, sku, price, stock, attributes
        });

        const response = {
          message: 'Variant updated successfully',
          updateResult
        }

        return response;

      }
    );
  }

  deleteVariant = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {
        const id = ctx.params.id;
        validateID(id);
        const deleteResult = await this.variantRepo.deleteVariant(id);
        const response = {
          message: 'Variant deleted successfully',
          deleteResult
        }
        return response;
      }
    );
  }

}