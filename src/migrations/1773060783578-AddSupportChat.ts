import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupportChat1773060783578 implements MigrationInterface {
    name = 'AddSupportChat1773060783578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conversation_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "isFromAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "conversation_id" uuid, CONSTRAINT "PK_113248f25c4c0a7c179b3f5a609" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guestName" character varying, "guestEmail" character varying, "isAnonymous" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "conversation_messages" ADD CONSTRAINT "FK_8e166abf2dd2ee28670e53e6803" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a"`);
        await queryRunner.query(`ALTER TABLE "conversation_messages" DROP CONSTRAINT "FK_8e166abf2dd2ee28670e53e6803"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
        await queryRunner.query(`DROP TABLE "conversation_messages"`);
    }

}
