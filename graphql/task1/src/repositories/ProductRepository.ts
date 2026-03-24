import { DeleteResult, Repository, UpdateResult } from "typeorm";
import AppDataSource from "../lib/DB";
import { Product } from "../entities/ProductEntity";

export default class ProductRepository {

	private productRepo: Repository<Product>;

	constructor() {
		this.productRepo = AppDataSource.getRepository(Product);
	}

	createProduct = async (data: any): Promise<Product> => {
		const {
			id,
			title,
			tags,
			productType,
			category,
			status,
			vendor,
			publishedAt,
			createdAt,
			updatedAt
		} = data;
		const product: Product = this.productRepo.create({
			id,
			title,
			tags,
			productType,
			category,
			status,
			vendor,
			publishedAt,
			createdAt,
			updatedAt,
			shop: {
				name: process.env.SHOPIFY_STORE_NAME
			}
		});
		await this.productRepo.save(product);
		return product;
	}

	saveProduct = async (data: Product): Promise<void> => {

		if (await this.productRepo.exists({ where: { id: data.id } })) {
			await this.productRepo.save(data);
			return;
		}

		const newProduct = this.productRepo.create(data);
		await this.productRepo.save(newProduct);

	}

	updateProduct = async (id: string, data: any): Promise<UpdateResult> => {
		const response: UpdateResult = await this.productRepo.update(id, data);
		return response;
	}

	deleteProduct = async (id: string): Promise<DeleteResult> => {
		const response: DeleteResult = await this.productRepo.delete({ id });
		return response;
	}

	deleteAllProducts = async (): Promise<DeleteResult> => {
		const response: DeleteResult = await this.productRepo.deleteAll();
		return response;
	}

};