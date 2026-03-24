import { MigrationInterface, QueryRunner } from "typeorm";

export class SkuNotUniqueNeededInVariant1774337711890 implements MigrationInterface {
    name = 'SkuNotUniqueNeededInVariant1774337711890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "UQ_b0ec0f223eab03e884042a60414"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "UQ_b0ec0f223eab03e884042a60414" UNIQUE ("sku")`);
    }

}
