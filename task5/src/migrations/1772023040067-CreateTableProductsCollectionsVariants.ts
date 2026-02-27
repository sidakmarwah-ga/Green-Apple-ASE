import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableProductsCollectionsVariants1772023040067 implements MigrationInterface {
    name = 'CreateTableProductsCollectionsVariants1772023040067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "collection" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "tags" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "collectionId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "variant" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "sku" character varying NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "UQ_b0ec0f223eab03e884042a60414" UNIQUE ("sku"), CONSTRAINT "PK_f8043a8a34fa021a727a4718470" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD "productId" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_88991860e839c6153a7ec878d39" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_a39d98111ddda0b737e683ff847" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_a39d98111ddda0b737e683ff847"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_88991860e839c6153a7ec878d39"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "productId"`);
        await queryRunner.query(`DROP TABLE "variant"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "collection"`);
    }

}
