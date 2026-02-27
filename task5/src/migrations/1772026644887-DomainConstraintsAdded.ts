import { MigrationInterface, QueryRunner } from "typeorm";

export class DomainConstraintsAdded1772026644887 implements MigrationInterface {
    name = 'DomainConstraintsAdded1772026644887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "CHK_e7e02a2fa406e7914545639e61" CHECK ("totalAmount" > 0)`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "CHK_141ed0a0eff3b56734cb030dbb" CHECK ("numberOfUnitsOrdered" > 0)`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "CHK_9bb7d714f43f6a1824cb977d11" CHECK ("stock" >= 0)`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "CHK_2eb47a993ee1f4084d2cf04a72" CHECK ("price" > 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "CHK_2eb47a993ee1f4084d2cf04a72"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "CHK_9bb7d714f43f6a1824cb977d11"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "CHK_141ed0a0eff3b56734cb030dbb"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "CHK_e7e02a2fa406e7914545639e61"`);
    }

}
