import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnTypeImagesForProduct1769341976773 implements MigrationInterface {
    name = 'ChangeColumnTypeImagesForProduct1769341976773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" text array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" character varying NOT NULL`);
    }

}
