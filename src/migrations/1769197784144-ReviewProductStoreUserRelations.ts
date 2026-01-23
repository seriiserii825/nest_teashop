import { MigrationInterface, QueryRunner } from "typeorm";

export class ReviewProductStoreUserRelations1769197784144 implements MigrationInterface {
    name = 'ReviewProductStoreUserRelations1769197784144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "product_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "store_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_53d569324f429e5d3af161f1657" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_53d569324f429e5d3af161f1657"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "store_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "user_id"`);
    }

}
