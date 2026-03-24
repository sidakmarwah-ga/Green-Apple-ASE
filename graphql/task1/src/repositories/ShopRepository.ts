import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Shop } from "../entities/ShopEntity";
import AppDataSource from "../lib/DB";

export default class ShopRepository {
  private shopRepo: Repository<Shop>;

	constructor() {
		this.shopRepo = AppDataSource.getRepository(Shop);
	}

  checkIfShopExist = async (name: string): Promise<boolean> => {
    const isShopFound = await this.shopRepo.exists({
      where: {name}
    });
    return isShopFound;
  }

  getShopByName = async (name: string): Promise<Shop | null> => {
    const shop = await this.shopRepo.findOne({
      where: {name}
    });
    return shop;
  }

  deleteShopByName = async (name: string): Promise<DeleteResult> => {
    const deleteResult = await this.shopRepo.delete({
      name
    });
    return deleteResult;
  }

  createShop = async (name: string, lastSyncAt: Date): Promise<Shop> => {
    const shop = this.shopRepo.create({
      name,
      lastSync: lastSyncAt
    });

    await this.shopRepo.save(shop);

    return shop;
  }

  updateShopLastSyncTime = async (name: string, lastSyncAt: Date): Promise<UpdateResult> => {
    const updateResult = await this.shopRepo.update(
      name,
      {
        lastSync: lastSyncAt
      }
    );
    return updateResult;
  }

}