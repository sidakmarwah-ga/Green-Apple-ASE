import VariantRepository from "../repositories/VariantRepository";
import { Variant } from "../entities/VariantEntity";
import { fetchShopifyDeletedVarinats, fetchShopifyVariants } from "../services/VariantServices";

export default class VariantController {

  private variantRepo: VariantRepository;

  constructor() {
    this.variantRepo = new VariantRepository();
  }

  fetchAllVariants = async () => {

    let endCursor: string | null = null;
    let hasNextPage = true;

    await this.variantRepo.deleteAllVariants();

    while (hasNextPage) {

      const data = await fetchShopifyVariants(endCursor);

      // save to db
      const variants: Variant[] = data.productVariants.nodes;
      variants.forEach(async (variant) => {
        await this.variantRepo.createVariant(variant);
      });

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

    while(hasNextPage) {

      const data = await fetchShopifyDeletedVarinats(
        lastSyncAt,
        endCursor
      );

      const deletedVariants = data.events.nodes;

      console.log(deletedVariants);

      // delete form db
      await this.variantRepo.deleteMultipleVariants(deletedVariants);

      // setting variables for further fetches
      hasNextPage = data.events.pageInfo.hasNextPage;
      endCursor = data.events.pageInfo.endCursor;

    }

    endCursor = null;
    hasNextPage = true;

    console.log('Updating variants');

    while(hasNextPage) {

      const query = `updated_at:>="${lastSyncAt.toUTCString()}"`;

      const data = await fetchShopifyVariants(
        endCursor,
        query
      );

      // save to db
      const updatedVariants: Variant[] = data.productVariants.nodes;

      // console.log(updatedVariants);

      updatedVariants.forEach(async (variant) => {
        console.log(variant.id);
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