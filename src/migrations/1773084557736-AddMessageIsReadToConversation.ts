import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageIsReadToConversation1773084557736 implements MigrationInterface {
    name = 'AddMessageIsReadToConversation1773084557736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation_messages" ADD "isRead" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation_messages" DROP COLUMN "isRead"`);
    }

}
