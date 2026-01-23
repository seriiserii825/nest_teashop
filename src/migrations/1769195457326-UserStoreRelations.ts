import { MigrationInterface, QueryRunner } from "typeorm";

export class UserStoreRelations1769195457326 implements MigrationInterface {
    name = 'UserStoreRelations1769195457326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_29f39971656b4bf7832b7476d10" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_29f39971656b4bf7832b7476d10"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "user_id"`);
    }

}
