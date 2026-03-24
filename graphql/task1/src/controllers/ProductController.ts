import ProductRepository from "../repositories/ProductRepository";
import { Product } from "../entities/ProductEntity";
import { fetchShopifyDeletedProducts, fetchShopifyProducts } from "../services/ProductServices";
import ShopRepository from "../repositories/ShopRepository";

export default class ProductController {

  private productRepo: ProductRepository;
  private shopRepo: ShopRepository;

  constructor() {
    this.productRepo = new ProductRepository();
    this.shopRepo = new ShopRepository();
  }

  fetchAllProducts = async () => {

    let endCursor: string | null = null;
    let hasNextPage = true;

    await this.productRepo.deleteAllProducts();

    while (hasNextPage) {

      const data = await fetchShopifyProducts(endCursor);

      // save to db
      const productsRawData: Product[] = data.products.nodes;
      // productsRawData.forEach(async (product) => {
      //   await this.productRepo.saveProduct(product);
      // });

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

    }

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
      // deletedProducts.forEach(async (product: any) => {
      //   await this.productRepo.deleteProduct(product.subjectId);
      // });
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