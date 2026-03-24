import { MigrationInterface, QueryRunner } from "typeorm";

export class ShopColumnAddedToVariant1774350741988 implements MigrationInterface {
    name = 'ShopColumnAddedToVariant1774350741988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" ADD "shopName" character varying`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_f9672cb59d7553123cf912d0e3b" FOREIGN KEY ("shopName") REFERENCES "shop"("name") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_f9672cb59d7553123cf912d0e3b"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "shopName"`);
    }

}
