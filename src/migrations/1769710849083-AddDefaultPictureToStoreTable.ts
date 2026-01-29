import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultPictureToStoreTable1769710849083 implements MigrationInterface {
    name = 'AddDefaultPictureToStoreTable1769710849083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "picture" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "picture" SET DEFAULT '/uploads/no-store.webp'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "picture" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "stores" ALTER COLUMN "picture" DROP NOT NULL`);
    }

}
