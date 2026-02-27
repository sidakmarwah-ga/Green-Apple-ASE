import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedVariantAttributes1772028541044 implements MigrationInterface {
    name = 'AddedVariantAttributes1772028541044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" RENAME COLUMN "createdAt" TO "attributes"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "attributes"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "attributes" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "attributes"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "attributes" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "variant" RENAME COLUMN "attributes" TO "createdAt"`);
    }

}
