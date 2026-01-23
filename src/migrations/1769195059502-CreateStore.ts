import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStore1769195059502 implements MigrationInterface {
    name = 'CreateStore1769195059502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stores" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "string" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stores"`);
    }

}
