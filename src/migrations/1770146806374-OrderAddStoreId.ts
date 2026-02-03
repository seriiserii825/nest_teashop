import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderAddStoreId1770146806374 implements MigrationInterface {
  name = 'OrderAddStoreId1770146806374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "store_id" integer NULL`);
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_b7a7bb813431fc7cd73cced0001" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_b7a7bb813431fc7cd73cced0001"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "store_id"`);
  }
}
