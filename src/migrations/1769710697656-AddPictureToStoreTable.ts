import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPictureToStoreTable1769710697656 implements MigrationInterface {
    name = 'AddPictureToStoreTable1769710697656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "picture" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "picture"`);
    }

}
