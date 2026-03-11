import { DeleteResult, In, Repository, UpdateResult } from "typeorm";
import { Collection } from "../entities/Collection";
import AppDataSource from "../lib/DB";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";
import ProductRepository from "./ProductRepository";
import { Product } from "../entities/Product";

export default class CollectionRepository {

	private collectionRepo: Repository<Collection>;

	constructor() {
		this.collectionRepo = AppDataSource.getRepository(Collection);
	}

	getAllCollection = async (options?: any) => {
		const collections: Collection[] = await this.collectionRepo.find({
			...options
		});
		return collections;
	}

	getCollectionByID = async (id: number): Promise<Collection> => {
		const collection: Collection | null = await this.collectionRepo.findOne({
			where: { id },
			relations: ['products']
		});
		if (!collection) {
			throw new AppError(HTTP_STATUS.NOT_FOUND, 'Collection not found');
		}
		return collection;
	}

	createCollection = async (data: any): Promise<Collection> => {
		const { title } = data;
		const collection: Collection = this.collectionRepo.create({
			title
		});
		await this.collectionRepo.save(collection);
		return collection;
	}

	updateCollection = async (id: number, data: any): Promise<UpdateResult> => {
		const response: UpdateResult = await this.collectionRepo.update(
			id, data
		);
		if (response.affected === 0) {
			throw new AppError(HTTP_STATUS.NOT_FOUND, 'Collection not found');
		}
		return response;
	}


	// *****************************

	// This way does notwork for deleting the many to many,
	// In the Entity defination, where the @join table decorator is mentioned, that side would be deleted with delete, but on the other side of many to many,
	// remove function works instead of delete

	// *****************************

	// deleteCollection = async (id: number): Promise<DeleteResult> => {
	// 	const response: DeleteResult = await this.collectionRepo.delete({ id });
	// 	if (response.affected === 0) {
	// 		throw new AppError(HTTP_STATUS.NOT_FOUND, 'Collection not found');
	// 	}
	// 	return response;
	// }
	
	// *****************************


	deleteCollection = async (id: number): Promise<Collection> => {
		const collection = await this.getCollectionByID(id);
		await this.collectionRepo.remove(collection);
		return collection;
	}

	updateCollectionProducts = async (id: number,
		toAdd: number[], toRemove: number[]
	): Promise<Collection> => {
		const collection: Collection | null = await this.collectionRepo.findOne({
			where: { id },
			relations: ['products'],
			select: {
				id: true,
				products: {
					id: true
				}
			}
		});

		if (!collection) {
			throw new AppError(HTTP_STATUS.NOT_FOUND, 'Collection not found');
		}

		const productRepo = new ProductRepository();
		const productsToAdd: Product[] = await productRepo.getAllProducts({
			where: {
				id: In(toAdd)
			},
			select: {
				id: true
			}
		});
		const originalProductIds: Product[] = collection.products;

		collection.products = [
			...originalProductIds.filter(p => !toRemove.includes(p.id)),
			...productsToAdd.filter(p => !originalProductIds.find(prod => prod.id === p.id))
		];

		await this.collectionRepo.save(collection);

		return collection;

	}

};