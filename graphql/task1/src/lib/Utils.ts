import { Context } from "koa";
import { AppError } from "./AppError";
import { HTTP_STATUS } from "./Constants";

export const errorHandler = (error: any, ctx: Context) => {
  if(error instanceof AppError) {
    ctx.throw(error.statusCode, error.message);
  }
  console.log('Error:', error);
  ctx.throw(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Internal server error');
}

export const checkEnvironmentVariables = async () => {
  if(
    !process.env.PORT
    || !process.env.POSTGRES_HOST
    || !process.env.POSTGRES_PORT
    || !process.env.POSTGRES_USER
    || !process.env.POSTGRES_PASSWORD
    || !process.env.POSTGRES_DB
    || !process.env.SHOPIFY_STORE_NAME
    || !process.env.SHOPIFY_ACCESS_TOKEN
    || !process.env.SHOPIFY_API_VERSION
  ) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'Environment Variables are not set.'
    );
  }
}