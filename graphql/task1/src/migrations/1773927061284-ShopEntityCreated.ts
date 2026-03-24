import { MigrationInterface, QueryRunner } from "typeorm";

export class ShopEntityCreated1773927061284 implements MigrationInterface {
    name = 'ShopEntityCreated1773927061284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shop" ("name" character varying NOT NULL, "lastSync" TIMESTAMP NOT NULL, CONSTRAINT "PK_f0640e30fef1d175426d80dbc13" PRIMARY KEY ("name"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD "shopName" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_e394b1bf65d9dde2dafd5ab0e34" FOREIGN KEY ("shopName") REFERENCES "shop"("name") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_e394b1bf65d9dde2dafd5ab0e34"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "shopName"`);
        await queryRunner.query(`DROP TABLE "shop"`);
    }

}
