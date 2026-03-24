import { Context } from "koa";
import ProductController from "./ProductController";
import VariantController from "./VariantController";
import { errorHandler } from "../lib/Utils";
import ShopRepository from "../repositories/ShopRepository";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";

const productController = new ProductController();
const variantController = new VariantController();
const shopRepo = new ShopRepository();

export const fetchController = async (ctx: Context) => {

  try {

    const isShopFound = await shopRepo.checkIfShopExist(process.env.SHOPIFY_STORE_NAME!);

    if(isShopFound) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Try using /sync route, as /fetch has already been called once.'
      );
    }

    const timeNow = new Date();

    await shopRepo.createShop(
      process.env.SHOPIFY_STORE_NAME!,
      timeNow
    );

    await productController.fetchAllProducts();
    await variantController.fetchAllVariants();

  } catch (error: any) {
    await shopRepo.deleteShopByName(process.env.SHOPIFY_STORE_NAME!);
    errorHandler(error, ctx);
  }

  ctx.status = 200;
  ctx.body = {
    message: 'Products and Variants fetched and saved to DB successfully'
  };

}

export const syncFunction = async () => {
  
  console.log('Sync Function called');

  const timeNow = new Date();

  console.log(timeNow.toLocaleString());
  
  const shop = await shopRepo.getShopByName(process.env.SHOPIFY_STORE_NAME!);

  if(!shop) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Try using /fetch route, as /sync can only be called when /fetch has been used once.'
    );
  }


  const lastSyncTime = shop.lastSync;

  await productController.syncProducts(lastSyncTime);
  await variantController.syncVariants(lastSyncTime);

  await shopRepo.updateShopLastSyncTime(process.env.SHOPIFY_STORE_NAME!, timeNow);

  console.log('Sync function executed');

}

export const syncController = async (ctx: Context) => {

  try {

    await syncFunction();

  } catch (error: any) {
    errorHandler(error, ctx);
  }

  ctx.status = 200;
  ctx.body = {
    message: 'Products and Variants are in sync.'
  };

}