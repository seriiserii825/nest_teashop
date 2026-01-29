import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductTableChangedPriceType1769701711187 implements MigrationInterface {
  name = 'ProductTableChangedPriceType1769701711187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Just change the column type, don't drop it
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE numeric(10,2) USING price::numeric(10,2)`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "picture" SET DEFAULT '/uploads/no-user.webp'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "picture" SET DEFAULT '/uploads/no-user-image.png'`,
    );

    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "price" TYPE integer USING price::integer`,
    );
  }
}
