import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductSchemaChangedNewFieldsAdded1773916933512 implements MigrationInterface {
    name = 'ProductSchemaChangedNewFieldsAdded1773916933512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "productType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "category" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "vendor" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "publishedAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "tags" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "tags" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "publishedAt"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "vendor"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productType"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "description" character varying NOT NULL`);
    }

}
