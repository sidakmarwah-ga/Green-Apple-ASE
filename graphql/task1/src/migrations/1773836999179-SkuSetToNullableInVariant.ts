import { MigrationInterface, QueryRunner } from "typeorm";

export class SkuSetToNullableInVariant1773836999179 implements MigrationInterface {
    name = 'SkuSetToNullableInVariant1773836999179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" ALTER COLUMN "sku" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" ALTER COLUMN "sku" SET NOT NULL`);
    }

}
