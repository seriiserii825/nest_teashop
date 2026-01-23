import { MigrationInterface, QueryRunner } from "typeorm";

export class FinishedOrderRelations1769198910974 implements MigrationInterface {
    name = 'FinishedOrderRelations1769198910974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ADD "product_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "store_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_fb643226ed89f5074870af43d72" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_fb643226ed89f5074870af43d72"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "store_id"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "product_id"`);
    }

}
