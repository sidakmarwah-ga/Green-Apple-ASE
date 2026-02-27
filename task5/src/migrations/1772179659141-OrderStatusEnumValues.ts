import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderStatusEnumValues1772179659141 implements MigrationInterface {
    name = 'OrderStatusEnumValues1772179659141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('Pending', 'Confirmed', 'Complete', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "status" "public"."order_status_enum" NOT NULL DEFAULT 'Pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "status" character varying NOT NULL`);
    }

}
