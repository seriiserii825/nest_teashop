import { MigrationInterface, QueryRunner } from "typeorm";

export class FavoritesProductsRelation1770967070488 implements MigrationInterface {
    name = 'FavoritesProductsRelation1770967070488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorite_products" ("user_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_6b38b391113aa0ca9360f470da3" PRIMARY KEY ("user_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3f5c6496edcc249b5edcb54add" ON "user_favorite_products" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce71c9d4ce234802e27f909c64" ON "user_favorite_products" ("product_id") `);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b7a7bb813431fc7cd73cced0001"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "store_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b7a7bb813431fc7cd73cced0001" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favorite_products" ADD CONSTRAINT "FK_3f5c6496edcc249b5edcb54add7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorite_products" ADD CONSTRAINT "FK_ce71c9d4ce234802e27f909c64a" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorite_products" DROP CONSTRAINT "FK_ce71c9d4ce234802e27f909c64a"`);
        await queryRunner.query(`ALTER TABLE "user_favorite_products" DROP CONSTRAINT "FK_3f5c6496edcc249b5edcb54add7"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b7a7bb813431fc7cd73cced0001"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "store_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b7a7bb813431fc7cd73cced0001" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce71c9d4ce234802e27f909c64"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f5c6496edcc249b5edcb54add"`);
        await queryRunner.query(`DROP TABLE "user_favorite_products"`);
    }

}
