import { MigrationInterface, QueryRunner } from "typeorm";

export class PriceTypeChangedInVariant1773836318899 implements MigrationInterface {
    name = 'PriceTypeChangedInVariant1773836318899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "CHK_2eb47a993ee1f4084d2cf04a72"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "price" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "CHK_2eb47a993ee1f4084d2cf04a72" CHECK ("price" > 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "CHK_2eb47a993ee1f4084d2cf04a72"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "CHK_2eb47a993ee1f4084d2cf04a72" CHECK ((price > 0))`);
    }

}
