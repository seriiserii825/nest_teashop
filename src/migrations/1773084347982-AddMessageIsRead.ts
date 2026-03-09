import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageIsRead1773084347982 implements MigrationInterface {
    name = 'AddMessageIsRead1773084347982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD "isRead" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP COLUMN "isRead"`);
    }

}
