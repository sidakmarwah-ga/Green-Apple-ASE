import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Variant } from "../entities/Variant";
import AppDataSource from "../lib/DB";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";
import ProductRepository from "./ProductRepository";

export default class VariantRepository {

  private variantRepo: Repository<Variant>;

  constructor() {
    this.variantRepo = AppDataSource.getRepository(Variant);
  }

  getAllVariants = async (options: any): Promise<Variant[]> => {
    const variants: Variant[] = await this.variantRepo.find({
      ...options
    });

    return variants;
  }

  getVariantByID = async (id: number): Promise<Variant> => {
    const variant: Variant | null = await this.variantRepo.findOne({
      where: { id }
    });

    if (!variant) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Variant not found'
      );
    }

    return variant;
  }

  createVariant = async (data: any) => {
    const {
      title,
      productID,
      sku,
      price,
      stock,
      attributes
    } = data;

    const isSkuUsed = await this.variantRepo.exists({
      where: { sku }
    });

    if (isSkuUsed) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'A variant already exists with same SKU'
      );
    }

    const productRepo = new ProductRepository();
    const isProductFound = await productRepo.checkIfProductExist({
      where: {
        id: productID
      }
    });

    if (!isProductFound) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Invalid product ID'
      );
    }

    const variant = this.variantRepo.create({
      title,
      product: {
        id: productID
      },
      sku,
      price,
      stock,
      attributes
    });

    await this.variantRepo.save(variant);

    return variant;

  }

  updateVariant = async (id: number, data: any): Promise<UpdateResult> => {

    const { title, sku, price, stock, attributes }: any = data;

    if (sku) {

      const isSkuUsed = await this.variantRepo.exists({
        where: { sku }
      });

      if (isSkuUsed) {
        throw new AppError(
          HTTP_STATUS.BAD_REQUEST,
          'A variant already exists with same SKU'
        );
      }
      
    }

    const updateResult: UpdateResult = await this.variantRepo.update(id, {
      title, sku, price, stock, attributes
    });

    if (updateResult.affected === 0) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Variant not found'
      );
    }

    return updateResult;

  }

  deleteVariant = async (id: number): Promise<DeleteResult> => {
    const deleteReselt = await this.variantRepo.delete({ id });

    if (deleteReselt.affected === 0) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        'Variant not found'
      );
    }

    return deleteReselt;
  }

}