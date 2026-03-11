import { DeleteResult, In, Not, Repository, UpdateResult } from "typeorm";
import { Product } from "../entities/Product";
import AppDataSource from "../lib/DB";
import { AppError } from "../lib/AppError";
import { HTTP_STATUS } from "../lib/Constants";
import { Collection } from "../entities/Collection";
import CollectionRepository from "./CollectionRepository";
import OrderRepository from "./OrderRepository";
import { Order } from "../entities/Order";
import { OrderStatus } from "../lib/Types";

export default class ProductRepository {

	private productRepo: Repository<Product>;

	constructor() {
		this.productRepo = AppDataSource.getRepository(Product);
	}

	getCurrentFields = () => {
		return this.productRepo.metadata.propertiesMap;
	}

	getAllProducts = async (options?: any): Promise<Product[]> => {
		const products: Product[] = await this.productRepo.find({
			...options
		});
		return products;
	}

	getProductByID = async (id: number): Promise<Product> => {
		const product: Product | null = await this.productRepo.findOne({
			where: { id },
			relations: ['collections', 'variants']
		});
		if (!product) {
			throw new AppError(HTTP_STATUS.NOT_FOUND, 'Product not found');
		}
		return product;
	}

	checkIfProductExist = async (options: any): Promise<boolean> => {
		return await this.productRepo.exists({
			...options
		});
	}

	createProduct = async (data: any): Promise<Product> => {
		const { title, description, tags } = data;
		const product: Product = this.productRepo.create({
			title, description, tags
		});
		await this.productRepo.save(product);
		return product;
	}

	updateProduct = async (id: number, data: any): Promise<UpdateResult> => {
		const response: UpdateResult = await this.productRepo.update(id, data);
		if (response.affected === 0) {
			throw new AppError(HTTP_STATUS.NOT_FOUND, 'Product not found');
		}
		return response;
	}

	deleteProduct = async (id: number): Promise<DeleteResult> => {
		const response: DeleteResult = await this.productRepo.delete({ id });
		if (response.affected === 0) {
			throw new AppError(HTTP_STATUS.NOT_FOUND, 'Product not found');
		}
		return response;
	}

	updateProductCollections = async (id: number, toAdd: number[],
		toRemove: number[]
	): Promise<Product> => {

		const product: Product | null = await this.productRepo.findOne({
			where: { id },
			relations: ['collections'],
			select: {
				id: true,
				collections: {
					id: true
				}
			}
		});

		if (!product) {
			throw new AppError(HTTP_STATUS.NOT_FOUND, 'Product not found');
		}
		const collectionRepo = new CollectionRepository();
		const toAddCollections: Collection[] = await collectionRepo.getAllCollection({
			where: {
				id: In(toAdd)
			},
			select: {
				id: true
			}
		});

		product.collections = [
			...product?.collections.filter(c => !toRemove.includes(c.id)),
			...toAddCollections.filter(c => !product?.collections.find(col => col.id === c.id))
		];

		await this.productRepo.save(product);

		return product;
	}

	numberOfSalesOfProduct = async (id : number) : Promise<Order[]> => {

		const isProductValid = await this.productRepo.exists({
			where: {id}
		});

		if(!isProductValid) {
			throw new AppError(
				HTTP_STATUS.NOT_FOUND,
				'Product not found'
			);
		}
		
		const orderRepo = new OrderRepository();

		const orders = await orderRepo.getAllOrders({
			where: {
				product: {id},
				status: Not(OrderStatus.RETURNED)
			},
			select: {
				numberOfUnitsOrdered: true
			}
		});

		return orders;
		
	}

};