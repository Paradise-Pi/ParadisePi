import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationshipTweaks1650710231368 implements MigrationInterface {
    name = 'RelationshipTweaks1650710231368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "temporary_config"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "config"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "config"`);
        await queryRunner.query(`ALTER TABLE "temporary_config" RENAME TO "config"`);
        await queryRunner.query(`CREATE TABLE "temporary_lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text)`);
        await queryRunner.query(`INSERT INTO "temporary_lxConfig"("key", "value", "name", "description", "canEdit", "options") SELECT "key", "value", "name", "description", "canEdit", "options" FROM "lxConfig"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "lxConfig"`);
        await queryRunner.query(`ALTER TABLE "temporary_lxConfig" RENAME TO "lxConfig"`);
        await queryRunner.query(`CREATE TABLE "temporary_sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "temporary_sndConfig"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "sndConfig"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "sndConfig"`);
        await queryRunner.query(`ALTER TABLE "temporary_sndConfig" RENAME TO "sndConfig"`);
        await queryRunner.query(`CREATE TABLE "temporary_config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_604248da1c13d8aaa1e145ffb83" UNIQUE ("key"))`);
        await queryRunner.query(`INSERT INTO "temporary_config"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "config"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "config"`);
        await queryRunner.query(`ALTER TABLE "temporary_config" RENAME TO "config"`);
        await queryRunner.query(`CREATE TABLE "temporary_lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text, CONSTRAINT "UQ_3288e120d284d49f0824d4cabae" UNIQUE ("key"))`);
        await queryRunner.query(`INSERT INTO "temporary_lxConfig"("key", "value", "name", "description", "canEdit", "options") SELECT "key", "value", "name", "description", "canEdit", "options" FROM "lxConfig"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "lxConfig"`);
        await queryRunner.query(`ALTER TABLE "temporary_lxConfig" RENAME TO "lxConfig"`);
        await queryRunner.query(`CREATE TABLE "temporary_sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_cbce0e6f1c064caedc583e9f82e" UNIQUE ("key"))`);
        await queryRunner.query(`INSERT INTO "temporary_sndConfig"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "sndConfig"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "sndConfig"`);
        await queryRunner.query(`ALTER TABLE "temporary_sndConfig" RENAME TO "sndConfig"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sndConfig" RENAME TO "temporary_sndConfig"`);
        await queryRunner.query(`CREATE TABLE "sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "sndConfig"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "temporary_sndConfig"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "temporary_sndConfig"`);
        await queryRunner.query(`ALTER TABLE "lxConfig" RENAME TO "temporary_lxConfig"`);
        await queryRunner.query(`CREATE TABLE "lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text)`);
        await queryRunner.query(`INSERT INTO "lxConfig"("key", "value", "name", "description", "canEdit", "options") SELECT "key", "value", "name", "description", "canEdit", "options" FROM "temporary_lxConfig"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "temporary_lxConfig"`);
        await queryRunner.query(`ALTER TABLE "config" RENAME TO "temporary_config"`);
        await queryRunner.query(`CREATE TABLE "config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "config"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "temporary_config"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "temporary_config"`);
        await queryRunner.query(`ALTER TABLE "sndConfig" RENAME TO "temporary_sndConfig"`);
        await queryRunner.query(`CREATE TABLE "sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "sndConfig"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "temporary_sndConfig"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "temporary_sndConfig"`);
        await queryRunner.query(`ALTER TABLE "lxConfig" RENAME TO "temporary_lxConfig"`);
        await queryRunner.query(`CREATE TABLE "lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text)`);
        await queryRunner.query(`INSERT INTO "lxConfig"("key", "value", "name", "description", "canEdit", "options") SELECT "key", "value", "name", "description", "canEdit", "options" FROM "temporary_lxConfig"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "temporary_lxConfig"`);
        await queryRunner.query(`ALTER TABLE "config" RENAME TO "temporary_config"`);
        await queryRunner.query(`CREATE TABLE "config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "config"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "temporary_config"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "temporary_config"`);
    }

}
