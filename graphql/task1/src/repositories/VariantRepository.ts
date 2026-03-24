import { DeleteResult, In, Repository, UpdateResult } from "typeorm";
import AppDataSource from "../lib/DB";
import { Variant } from "../entities/VariantEntity";

export default class VariantRepository {

  private variantRepo: Repository<Variant>;

  constructor() {
    this.variantRepo = AppDataSource.getRepository(Variant);
  }

  createVariant = async (data: any) => {
    const {
      id,
      title,
      displayName,
      product,
      sku,
      price,
      inventoryQuantity,
      createdAt,
      updatedAt
    } = data;

    const variant = this.variantRepo.create({
      id,
      title,
      displayName,
      product: {
        id: product.id
      },
      sku,
      price,
      stock: inventoryQuantity,
      createdAt,
      updatedAt
    });

    await this.variantRepo.save(variant);

    return variant;

  }

  updateVariant = async (id: string, data: any): Promise<UpdateResult> => {

    const { title, displayName, sku, price, inventoryQuantity, createdAt, updatedAt }: any = data;

    const updateResult: UpdateResult = await this.variantRepo.update(id, {
      title, displayName, sku, price, stock: inventoryQuantity, createdAt, updatedAt
    });

    return updateResult;

  }

  saveVariant = async (data: any): Promise<void> => {

    // console.log(data);

    const {
      id,
      title,
      displayName,
      product,
      sku,
      price,
      inventoryQuantity,
      createdAt,
      updatedAt
    } = data;

    const newVariant = this.variantRepo.create({
      id,
      title,
      displayName,
      product: {
        id: product.id
      },
      sku,
      price,
      stock: inventoryQuantity,
      createdAt,
      updatedAt
    });

    await this.variantRepo.save(newVariant);

  }

  deleteVariant = async (id: string): Promise<DeleteResult> => {

    const deleteReselt = await this.variantRepo.delete({ id });

    return deleteReselt;
  }

  deleteMultipleVariants = async (ids: any): Promise<DeleteResult> => {

    const deleteReselt = await this.variantRepo.delete({ id: In(ids.map((variant: any) => variant.subjectId)) });

    return deleteReselt;
  }

  deleteAllVariants = async (): Promise<DeleteResult> => {

    const deleteReselt = await this.variantRepo.deleteAll();

    return deleteReselt;
  }

}