import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductAndVariantEntityCreated1773666154654 implements MigrationInterface {
    name = 'ProductAndVariantEntityCreated1773666154654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "tags" text NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "variant" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "sku" character varying NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "attributes" jsonb NOT NULL, "productId" integer, CONSTRAINT "UQ_b0ec0f223eab03e884042a60414" UNIQUE ("sku"), CONSTRAINT "CHK_9bb7d714f43f6a1824cb977d11" CHECK ("stock" >= 0), CONSTRAINT "CHK_2eb47a993ee1f4084d2cf04a72" CHECK ("price" > 0), CONSTRAINT "PK_f8043a8a34fa021a727a4718470" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673"`);
        await queryRunner.query(`DROP TABLE "variant"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
