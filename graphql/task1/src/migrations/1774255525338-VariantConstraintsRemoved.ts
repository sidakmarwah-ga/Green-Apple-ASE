import { MigrationInterface, QueryRunner } from "typeorm";

export class VariantConstraintsRemoved1774255525338 implements MigrationInterface {
    name = 'VariantConstraintsRemoved1774255525338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "CHK_9bb7d714f43f6a1824cb977d11"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "CHK_2eb47a993ee1f4084d2cf04a72"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "CHK_2eb47a993ee1f4084d2cf04a72" CHECK ((price > (0)::double precision))`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "CHK_9bb7d714f43f6a1824cb977d11" CHECK ((stock >= 0))`);
    }

}
