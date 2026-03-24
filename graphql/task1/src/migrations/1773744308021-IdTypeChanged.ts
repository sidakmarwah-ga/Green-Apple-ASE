import { MigrationInterface, QueryRunner } from "typeorm";

export class IdTypeChanged1773744308021 implements MigrationInterface {
    name = 'IdTypeChanged1773744308021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "PK_bebc9158e480b949565b4dc7a82"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "PK_f8043a8a34fa021a727a4718470"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "id" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "PK_f8043a8a34fa021a727a4718470" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "productId" text`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "productId" integer`);
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "PK_f8043a8a34fa021a727a4718470"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "variant" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "PK_f8043a8a34fa021a727a4718470" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "PK_bebc9158e480b949565b4dc7a82"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
