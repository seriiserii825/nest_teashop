import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryStoreRelation1769196543840 implements MigrationInterface {
    name = 'CategoryStoreRelation1769196543840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "store_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_5848ba82e61b83e2aa416447a15" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_5848ba82e61b83e2aa416447a15"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "store_id"`);
    }

}
