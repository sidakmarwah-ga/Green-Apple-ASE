import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsCollectionsManyToMany1772029197355 implements MigrationInterface {
    name = 'ProductsCollectionsManyToMany1772029197355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_a39d98111ddda0b737e683ff847"`);
        await queryRunner.query(`CREATE TABLE "product_collections_collection" ("productId" integer NOT NULL, "collectionId" integer NOT NULL, CONSTRAINT "PK_dceeb8408ce8254af3f57fad051" PRIMARY KEY ("productId", "collectionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f32482db3349b6a253cc64acb0" ON "product_collections_collection" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3769896af838fc5aea2231d8d5" ON "product_collections_collection" ("collectionId") `);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "collectionId"`);
        await queryRunner.query(`ALTER TABLE "product_collections_collection" ADD CONSTRAINT "FK_f32482db3349b6a253cc64acb04" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_collections_collection" ADD CONSTRAINT "FK_3769896af838fc5aea2231d8d52" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_collections_collection" DROP CONSTRAINT "FK_3769896af838fc5aea2231d8d52"`);
        await queryRunner.query(`ALTER TABLE "product_collections_collection" DROP CONSTRAINT "FK_f32482db3349b6a253cc64acb04"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "collectionId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3769896af838fc5aea2231d8d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f32482db3349b6a253cc64acb0"`);
        await queryRunner.query(`DROP TABLE "product_collections_collection"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_a39d98111ddda0b737e683ff847" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
