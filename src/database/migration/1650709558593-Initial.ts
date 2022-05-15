import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initial1650709558593 implements MigrationInterface {
	name = 'Initial1650709558593'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text, CONSTRAINT "UQ_26489c99ddbb4c91631ef5cc791" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text, CONSTRAINT "UQ_acb62d59ac774aa66e3eb124501" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "lxPresetFolders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "parentFolderId" integer)`
		)
		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "lxPreset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "universe" text NOT NULL, "setArguments" text, "fadeTime" integer DEFAULT (0), "folderId" integer)`
		)
		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text, CONSTRAINT "UQ_aa2573524241f058b156e2c1919" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "sndFaders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "channel" integer, "enabled" boolean NOT NULL)`
		)
		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "sndPreset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "data" text)`
		)

		await queryRunner.query(
			`CREATE TABLE "temporary_config" ("key" varchar(255) PRIMARY KEY, "value" varchar(255), "name" varchar(255), "description" varchar(255), "canEdit" boolean DEFAULT ('1'), "options" text)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_config"("key", "value", "name", "description", "canEdit") SELECT "key", "value", "name", "description", "canEdit" FROM "config"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "config"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_config" RENAME TO "config"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_lxConfig" ("key" varchar(255) PRIMARY KEY, "value" varchar(255), "name" varchar(255), "description" varchar(255), "canEdit" boolean DEFAULT ('1'), "options" text)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_lxConfig"("key", "value", "name", "description", "canEdit") SELECT "key", "value", "name", "description", "canEdit" FROM "lxConfig"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_lxConfig" RENAME TO "lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_lxPreset" ("id" integer PRIMARY KEY NOT NULL, "name" varchar(255), "enabled" boolean, "universe" varchar(255), "setArguments" json, "fadeTime" integer DEFAULT (null), "folderId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_lxPreset"("id", "name", "enabled", "universe", "setArguments", "fadeTime") SELECT "id", "name", "enabled", "universe", "setArguments", "fadeTime" FROM "lxPreset"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "lxPreset"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_lxPreset" RENAME TO "lxPreset"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text, CONSTRAINT "UQ_604248da1c13d8aaa1e145ffb83" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_config"("key", "value", "name", "description", "canEdit", "options") SELECT "key", "value", "name", "description", "canEdit", "options" FROM "config"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "config"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_config" RENAME TO "config"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text, CONSTRAINT "UQ_3288e120d284d49f0824d4cabae" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_lxConfig"("key", "value", "name", "description", "canEdit", "options") SELECT "key", "value", "name", "description", "canEdit", "options" FROM "lxConfig"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_lxConfig" RENAME TO "lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_lxPreset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "universe" text NOT NULL, "setArguments" text, "fadeTime" integer DEFAULT (0), "folderId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_lxPreset"("id", "name", "enabled", "universe", "setArguments", "fadeTime", "folderId") SELECT "id", "name", "enabled", "universe", "setArguments", "fadeTime", "folderId" FROM "lxPreset"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "lxPreset"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_lxPreset" RENAME TO "lxPreset"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_cbce0e6f1c064caedc583e9f82e" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_sndConfig"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "sndConfig"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "sndConfig"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_sndConfig" RENAME TO "sndConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_sndFaders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "channel" integer, "enabled" boolean NOT NULL)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_sndFaders"("id", "name", "channel", "enabled") SELECT "id", "name", "channel", "enabled" FROM "sndFaders"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "sndFaders"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_sndFaders" RENAME TO "sndFaders"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_sndPreset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "data" text)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_sndPreset"("id", "name", "enabled", "data") SELECT "id", "name", "enabled", "data" FROM "sndPreset"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "sndPreset"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_sndPreset" RENAME TO "sndPreset"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_lxPresetFolders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "parentId" integer, CONSTRAINT "FK_cf72e37bb51ca0282f32be47bb6" FOREIGN KEY ("parentId") REFERENCES "lxPresetFolders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_lxPresetFolders"("id", "name", "parentId") SELECT "id", "name", "parentFolderId" FROM "lxPresetFolders"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "lxPresetFolders"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_lxPresetFolders" RENAME TO "lxPresetFolders"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_lxPreset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "universe" text NOT NULL, "setArguments" text, "fadeTime" integer DEFAULT (0), "folderId" integer, CONSTRAINT "FK_aba5355360b5c254f4a8fbeb1b5" FOREIGN KEY ("folderId") REFERENCES "lxPresetFolders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_lxPreset"("id", "name", "enabled", "universe", "setArguments", "fadeTime", "folderId") SELECT "id", "name", "enabled", "universe", "setArguments", "fadeTime", "folderId" FROM "lxPreset"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "lxPreset"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_lxPreset" RENAME TO "lxPreset"`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "lxPreset" RENAME TO "temporary_lxPreset"`
		)
		await queryRunner.query(
			`CREATE TABLE "lxPreset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "universe" text NOT NULL, "setArguments" text, "fadeTime" integer DEFAULT (0), "folderId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "lxPreset"("id", "name", "enabled", "universe", "setArguments", "fadeTime", "folderId") SELECT "id", "name", "enabled", "universe", "setArguments", "fadeTime", "folderId" FROM "temporary_lxPreset"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_lxPreset"`)
		await queryRunner.query(
			`ALTER TABLE "lxPresetFolders" RENAME TO "temporary_lxPresetFolders"`
		)
		await queryRunner.query(
			`CREATE TABLE "lxPresetFolders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "parentId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "lxPresetFolders"("id", "name", "parentId") SELECT "id", "name", "parentId" FROM "temporary_lxPresetFolders"`
		)
		await queryRunner.query(
			`DROP TABLE IF EXISTS "temporary_lxPresetFolders"`
		)
		await queryRunner.query(
			`ALTER TABLE "sndPreset" RENAME TO "temporary_sndPreset"`
		)
		await queryRunner.query(
			`CREATE TABLE "sndPreset" ("id" integer PRIMARY KEY NOT NULL, "name" varchar(255), "enabled" boolean, "data" json)`
		)
		await queryRunner.query(
			`INSERT INTO "sndPreset"("id", "name", "enabled", "data") SELECT "id", "name", "enabled", "data" FROM "temporary_sndPreset"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_sndPreset"`)
		await queryRunner.query(
			`ALTER TABLE "sndFaders" RENAME TO "temporary_sndFaders"`
		)
		await queryRunner.query(
			`CREATE TABLE "sndFaders" ("id" integer PRIMARY KEY NOT NULL, "name" varchar(255), "channel" integer, "enabled" boolean)`
		)
		await queryRunner.query(
			`INSERT INTO "sndFaders"("id", "name", "channel", "enabled") SELECT "id", "name", "channel", "enabled" FROM "temporary_sndFaders"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_sndFaders"`)
		await queryRunner.query(
			`ALTER TABLE "sndConfig" RENAME TO "temporary_sndConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "sndConfig" ("key" varchar(255) PRIMARY KEY, "value" varchar(255), "name" varchar(255), "description" varchar(255), "options" varchar(255), "canEdit" boolean DEFAULT ('1'))`
		)
		await queryRunner.query(
			`INSERT INTO "sndConfig"("key", "value", "name", "description", "options", "canEdit") SELECT "key", "value", "name", "description", "options", "canEdit" FROM "temporary_sndConfig"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_sndConfig"`)
		await queryRunner.query(
			`ALTER TABLE "lxPreset" RENAME TO "temporary_lxPreset"`
		)
		await queryRunner.query(
			`CREATE TABLE "lxPreset" ("id" integer PRIMARY KEY NOT NULL, "name" varchar(255), "enabled" boolean, "universe" varchar(255), "setArguments" json, "fadeTime" integer DEFAULT (null), "folderId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "lxPreset"("id", "name", "enabled", "universe", "setArguments", "fadeTime", "folderId") SELECT "id", "name", "enabled", "universe", "setArguments", "fadeTime", "folderId" FROM "temporary_lxPreset"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_lxPreset"`)
		await queryRunner.query(
			`ALTER TABLE "lxConfig" RENAME TO "temporary_lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "lxConfig" ("key" varchar(255) PRIMARY KEY, "value" varchar(255), "name" varchar(255), "description" varchar(255), "canEdit" boolean DEFAULT ('1'), "options" text)`
		)
		await queryRunner.query(
			`INSERT INTO "lxConfig"("key", "value", "name", "description", "canEdit", "options") SELECT "key", "value", "name", "description", "canEdit", "options" FROM "temporary_lxConfig"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "config" RENAME TO "temporary_config"`
		)
		await queryRunner.query(
			`CREATE TABLE "config" ("key" varchar(255) PRIMARY KEY, "value" varchar(255), "name" varchar(255), "description" varchar(255), "canEdit" boolean DEFAULT ('1'), "options" text)`
		)
		await queryRunner.query(
			`INSERT INTO "config"("key", "value", "name", "description", "canEdit", "options") SELECT "key", "value", "name", "description", "canEdit", "options" FROM "temporary_config"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_config"`)
		await queryRunner.query(
			`ALTER TABLE "lxPreset" RENAME TO "temporary_lxPreset"`
		)
		await queryRunner.query(
			`CREATE TABLE "lxPreset" ("id" integer PRIMARY KEY NOT NULL, "name" varchar(255), "enabled" boolean, "universe" varchar(255), "setArguments" json, "fadeTime" integer DEFAULT (null))`
		)
		await queryRunner.query(
			`INSERT INTO "lxPreset"("id", "name", "enabled", "universe", "setArguments", "fadeTime") SELECT "id", "name", "enabled", "universe", "setArguments", "fadeTime" FROM "temporary_lxPreset"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_lxPreset"`)
		await queryRunner.query(
			`ALTER TABLE "lxConfig" RENAME TO "temporary_lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "lxConfig" ("key" varchar(255) PRIMARY KEY, "value" varchar(255), "name" varchar(255), "description" varchar(255), "canEdit" boolean DEFAULT ('1'))`
		)
		await queryRunner.query(
			`INSERT INTO "lxConfig"("key", "value", "name", "description", "canEdit") SELECT "key", "value", "name", "description", "canEdit" FROM "temporary_lxConfig"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "config" RENAME TO "temporary_config"`
		)
		await queryRunner.query(
			`CREATE TABLE "config" ("key" varchar(255) PRIMARY KEY, "value" varchar(255), "name" varchar(255), "description" varchar(255), "canEdit" boolean DEFAULT ('1'))`
		)
		await queryRunner.query(
			`INSERT INTO "config"("key", "value", "name", "description", "canEdit") SELECT "key", "value", "name", "description", "canEdit" FROM "temporary_config"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "temporary_config"`)
		await queryRunner.query(`DROP TABLE IF EXISTS "lxPresetFolders"`)
	}
}
