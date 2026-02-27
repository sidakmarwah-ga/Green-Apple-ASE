import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVariantOrdersOneToManyRelation1772116776981 implements MigrationInterface {
    name = 'AddVariantOrdersOneToManyRelation1772116776981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "variantId" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_4b309fb702904538d9cb1687c71" FOREIGN KEY ("variantId") REFERENCES "variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_4b309fb702904538d9cb1687c71"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "variantId"`);
    }

}
