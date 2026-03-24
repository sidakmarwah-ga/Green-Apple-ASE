import { MigrationInterface, QueryRunner } from "typeorm";

export class PublishedDateNullableInProduct1774337276878 implements MigrationInterface {
    name = 'PublishedDateNullableInProduct1774337276878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "publishedAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "publishedAt" SET NOT NULL`);
    }

}
