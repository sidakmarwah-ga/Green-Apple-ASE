import { MigrationInterface, QueryRunner } from "typeorm";

export class VariantSchemaUpdated1773819807690 implements MigrationInterface {
    name = 'VariantSchemaUpdated1773819807690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" RENAME COLUMN "attributes" TO "displayName"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "displayName"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "displayName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "displayName"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "displayName" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "variant" RENAME COLUMN "displayName" TO "attributes"`);
    }

}
