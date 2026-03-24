import ProductRepository from "../repositories/ProductRepository";
import { Product } from "../entities/ProductEntity";
import { fetchShopifyDeletedProducts, fetchShopifyProducts, getTotalProductsCount } from "../services/ProductServices";
import { BatchSizes } from "../lib/Constants";
import { shopInfo } from "../services/ShopifyUtils";

export default class ProductController {

  private productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  fetchAllProducts = async () => {

    let endCursor: string | null = null;
    let hasNextPage = true;
    const batchSize = BatchSizes.full;

    await this.productRepo.deleteAllProducts();

    const totalProductCount = await getTotalProductsCount();
    const totalBatches = Math.ceil(totalProductCount / batchSize);

    console.log(`Fetching all Products of "${shopInfo.shopName}", total number of batches: ${totalBatches}`);

    let currentBatchNumber = 1;

    while (hasNextPage) {

      console.log(`Product Batch ${currentBatchNumber}, started.`);

      const data = await fetchShopifyProducts(endCursor, null, batchSize);

      // save to db
      const productsRawData: Product[] = data.products.nodes;

      const products: Product[] = productsRawData.map((product: any) => {
        return {
          ...product,
          shop: {
            name: process.env.SHOPIFY_STORE_NAME
          }
        }
      });

      await this.productRepo.saveMultipleProducts(products);

      // setting variables for further fetches
      hasNextPage = data.products.pageInfo.hasNextPage;
      endCursor = data.products.pageInfo.endCursor;

      console.log(`Product Batch ${currentBatchNumber}, ended.`);

      currentBatchNumber++;

    }

    console.log(`All Products fetched successfully in ${totalBatches} batches`);

  }

  syncProducts = async (lastSyncAt: Date) => {

    console.log('Sync Products called');

    let endCursor: string | null = null;
    let hasNextPage = true;

    console.log("Deleting products")

    while (hasNextPage) {

      const data = await fetchShopifyDeletedProducts(
        lastSyncAt,
        endCursor
      );

      const deletedProducts = data.events.nodes;
      const productIDs = deletedProducts.map((product: any) => product.subjectId);

      console.log(productIDs);

      // delete form db
      await this.productRepo.deleteProductsByIDs(productIDs);

      // setting variables for further fetches
      hasNextPage = data.events.pageInfo.hasNextPage;
      endCursor = data.events.pageInfo.endCursor;

    }

    endCursor = null;
    hasNextPage = true;

    console.log('Updating products');

    while (hasNextPage) {

      const query = `updated_at:>="${lastSyncAt.toUTCString()}"`;

      const data = await fetchShopifyProducts(
        endCursor,
        query
      );

      // save to db
      const updatedProducts: Product[] = data.products.nodes;

      // console.log(updatedProducts);

      updatedProducts.forEach(async (product) => {
        console.log(product.id);
        await this.productRepo.saveProduct(
          product
        );
      });

      // setting variables for further fetches
      hasNextPage = data.products.pageInfo.hasNextPage;
      endCursor = data.products.pageInfo.endCursor;

    }

    console.log('Sync Products executed');

  }

}