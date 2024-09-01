import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDevices1725184396730 implements MigrationInterface {
	name = 'AddDevices1725184396730'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "devices" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "ip" text, "endpoint" text, "statusCheckPath" text, "statusCheckString" text, "notes" text, "sort" integer NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text, "deviceId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon" FROM "presets"`
		)
		await queryRunner.query(`DROP TABLE "presets"`)
		await queryRunner.query(`ALTER TABLE "temporary_presets" RENAME TO "presets"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text, "deviceId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "deviceId") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "deviceId" FROM "presets"`
		)
		await queryRunner.query(`DROP TABLE "presets"`)
		await queryRunner.query(`ALTER TABLE "temporary_presets" RENAME TO "presets"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "parentId" integer, "sort" integer NOT NULL DEFAULT (1), "icon" text, "infoText" text)`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "presets" RENAME TO "temporary_presets"`)
		await queryRunner.query(
			`CREATE TABLE "presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text, "deviceId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "deviceId") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "deviceId" FROM "temporary_presets"`
		)
		await queryRunner.query(`DROP TABLE "temporary_presets"`)
		await queryRunner.query(`ALTER TABLE "presets" RENAME TO "temporary_presets"`)
		await queryRunner.query(
			`CREATE TABLE "presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text)`
		)
		await queryRunner.query(
			`INSERT INTO "presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon" FROM "temporary_presets"`
		)
		await queryRunner.query(`DROP TABLE "temporary_presets"`)
		await queryRunner.query(`DROP TABLE "devices"`)
	}
}
