import VariantRepository from "../repositories/VariantRepository";
import { Variant } from "../entities/VariantEntity";
import { fetchShopifyDeletedVariants, fetchShopifyVariants } from "../services/VariantServices";

export default class VariantController {

  private variantRepo: VariantRepository;

  constructor() {
    this.variantRepo = new VariantRepository();
  }

  fetchAllVariants = async () => {

    let endCursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {

      const data = await fetchShopifyVariants(endCursor);

      // save to db
      const variantsRawData = data.productVariants.nodes;
      // variantsRawData.forEach(async (variant) => {
      //   await this.variantRepo.saveVariant(variant);
      // });

      const variants: Variant[] = variantsRawData.map((variant: any) => {

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
        } = variant;

        return {
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
          updatedAt,
          shop: {
            name: process.env.SHOPIFY_STORE_NAME
          }
        }

      });

      await this.variantRepo.saveMultipleVariants(variants);

      // setting variables for further fetches
      hasNextPage = data.productVariants.pageInfo.hasNextPage;
      endCursor = data.productVariants.pageInfo.endCursor;

    }

  }

  syncVariants = async (lastSyncAt: Date) => {

    console.log('Sync variants called');

    let endCursor: string | null = null;
    let hasNextPage = true;

    console.log('Deleting variants');

    while (hasNextPage) {

      const data = await fetchShopifyDeletedVariants(
        lastSyncAt,
        endCursor
      );

      const deletedVariants = data.events.nodes;
      const variantIDs = deletedVariants.map((variant: any) => variant.subjectId);

      console.log(variantIDs);

      // delete form db
      await this.variantRepo.deleteMultipleVariants(variantIDs);

      // setting variables for further fetches
      hasNextPage = data.events.pageInfo.hasNextPage;
      endCursor = data.events.pageInfo.endCursor;

    }

    endCursor = null;
    hasNextPage = true;

    console.log('Updating variants');

    while (hasNextPage) {

      const query = `updated_at:>="${lastSyncAt.toUTCString()}"`;

      const data = await fetchShopifyVariants(
        endCursor,
        query
      );

      // save to db
      const updatedVariantsRaw = data.productVariants.nodes;

      // console.log(updatedVariantsRaw);

      updatedVariantsRaw.forEach(async (variantRaw: any) => {

        console.log(variantRaw.id);

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
        } = variantRaw;

        const variant = {
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
          updatedAt,
          shop: {
            name: process.env.SHOPIFY_STORE_NAME
          }
        }

        await this.variantRepo.saveVariant(
          variant
        );
      });

      // setting variables for further fetches
      hasNextPage = data.productVariants.pageInfo.hasNextPage;
      endCursor = data.productVariants.pageInfo.endCursor;

    }

    console.log('Sync variants executed');

  }

}