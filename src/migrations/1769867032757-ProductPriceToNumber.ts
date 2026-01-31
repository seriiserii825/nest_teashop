import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductPriceToNumber1769867032757 implements MigrationInterface {
  name = 'ProductPriceToNumber1769867032757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Update null values to 0 (or any default value)
    await queryRunner.query(
      `UPDATE "products" SET "price" = 0 WHERE "price" IS NULL`,
    );

    // Step 2: Change column type from decimal to integer
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE integer USING price::integer`,
    );

    // Step 3: Add NOT NULL constraint
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert back to decimal
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE decimal(10,2) USING price::decimal`,
    );
  }
}
