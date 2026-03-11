import { MigrationInterface, QueryRunner } from "typeorm";

export class OnDeleteActionsDefinedForOrdersProductsVariants1772802825541 implements MigrationInterface {
    name = 'OnDeleteActionsDefinedForOrdersProductsVariants1772802825541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_4b309fb702904538d9cb1687c71"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_88991860e839c6153a7ec878d39"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_88991860e839c6153a7ec878d39" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_4b309fb702904538d9cb1687c71" FOREIGN KEY ("variantId") REFERENCES "variant"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_4b309fb702904538d9cb1687c71"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_88991860e839c6153a7ec878d39"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_88991860e839c6153a7ec878d39" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_4b309fb702904538d9cb1687c71" FOREIGN KEY ("variantId") REFERENCES "variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
