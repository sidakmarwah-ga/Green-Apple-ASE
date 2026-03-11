import { Context } from "koa";
import CollectionRepository from "../repositories/CollectionRepository";
import BaseController from "./BaseController";
import { takeSkipOptions, validateAddRemoveArray, validateID } from "../lib/Utils";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";
import { UpdateResult } from "typeorm";
import { Collection } from "../entities/Collection";

export default class CollectionController extends BaseController {

  private collectionRepo: CollectionRepository;

  constructor() {
    super();
    this.collectionRepo = new CollectionRepository();
  }

  getAllCollections = async (ctx: Context) => {

    return await BaseController.execute(
      ctx,
      async () => {
        const { take, skip } = ctx.query;

        const options = {
          ...takeSkipOptions(take, skip)
        };

        const collections = await this.collectionRepo.getAllCollection(options);

        const responseBody: any = {
          message: 'Collections fetched successfully',
          collections
        };

        return responseBody;
      }
    );

  }

  getCollectionByID = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const collection = await this.collectionRepo.getCollectionByID(id);

        const response = {
          message: 'Collection fetched successfully',
          collection
        }

        return response;
      }
    );
  }

  createCollection = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {
        const { title }: any = ctx.request.body;
        if (!title) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            'Collection title is required'
          );
        }

        const collection = await this.collectionRepo.createCollection({ title });

        const response = {
          message: 'Collection created successfully',
          collection
        };

        return response;
      }
    );
  }

  updateCollection = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const { title }: any = ctx.request.body;
        if (!title) {
          throw new AppError(
            HTTP_STATUS.BAD_REQUEST,
            'Collection title is required'
          );
        }

        const updateResult: UpdateResult = await this.collectionRepo.updateCollection(id, {
          title
        });

        const response = {
          message: 'Collection updated successfully',
          updateResult
        };

        return response;

      }
    );
  }

  deleteCollection = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const deletedCollection = await this.collectionRepo.deleteCollection(id);

        const response = {
          message: 'Collection deleted successfully',
          deletedCollection
        }

        return response;

      }
    );
  }

  updateCollectionProducts = async (ctx: Context) => {
    return await BaseController.execute(
      ctx,
      async () => {

        const id = ctx.params.id;
        validateID(id);

        const { toAdd, toRemove }: any = ctx.request.body;

        validateAddRemoveArray(toAdd, toRemove);

        const collection: Collection = await this.collectionRepo.updateCollectionProducts(id, toAdd ?? [], toRemove ?? []);

        return {
          message: 'Collection Products updated successfully',
          collection
        }

      }
    );
  }

}