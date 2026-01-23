import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedColumnStore1769195118073 implements MigrationInterface {
    name = 'ChangedColumnStore1769195118073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" RENAME COLUMN "string" TO "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" RENAME COLUMN "description" TO "string"`);
    }

}
