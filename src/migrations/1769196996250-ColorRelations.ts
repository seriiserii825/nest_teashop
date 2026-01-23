import { MigrationInterface, QueryRunner } from "typeorm";

export class ColorRelations1769196996250 implements MigrationInterface {
    name = 'ColorRelations1769196996250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "colors" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "value" character varying NOT NULL, "store_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3a62edc12d29307872ab1777ced" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD "color_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "colors" ADD CONSTRAINT "FK_006d8c2737c2560799a0de12f0d" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_733888c65449d717af1fccaf702" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_733888c65449d717af1fccaf702"`);
        await queryRunner.query(`ALTER TABLE "colors" DROP CONSTRAINT "FK_006d8c2737c2560799a0de12f0d"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "color_id"`);
        await queryRunner.query(`DROP TABLE "colors"`);
    }

}
