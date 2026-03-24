import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryInProductSetToNullable1774336901682 implements MigrationInterface {
    name = 'CategoryInProductSetToNullable1774336901682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "category" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "category" SET NOT NULL`);
    }

}
