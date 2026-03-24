import { MigrationInterface, QueryRunner } from "typeorm";

export class ImagesRemovedFromProductEntity1773817246038 implements MigrationInterface {
    name = 'ImagesRemovedFromProductEntity1773817246038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "images"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "images" text array`);
    }

}
