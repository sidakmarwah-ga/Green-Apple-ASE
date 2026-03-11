import { Context } from "koa"
import { AppError } from "../lib/AppError"
import { HTTP_STATUS } from "../lib/Constants";

export default class BaseController {
  protected static execute = async (
    ctx: Context,
    fn: () => Promise<any>,
    successStatusCode: number = 200
  ) => {

    try {

      const data = await fn();

      ctx.status = successStatusCode;
      ctx.body = {
        success: true,
        ...data
      };


    } catch (error: any) {
      if(error instanceof AppError) {
        ctx.throw(error.statusCode, error.message);
      }

      console.log(error);
      ctx.throw(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Internal server error');

    }

  }
}