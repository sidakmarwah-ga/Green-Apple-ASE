import { MigrationInterface, QueryRunner } from "typeorm";

export class ImagesAddedInProduct1773668356216 implements MigrationInterface {
    name = 'ImagesAddedInProduct1773668356216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "images" text array`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "tags" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "tags" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "images"`);
    }

}
