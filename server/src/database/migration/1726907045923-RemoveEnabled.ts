import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveEnabled1726907045923 implements MigrationInterface {
	name = 'RemoveEnabled1726907045923'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE presets SET displayVariableLogic = '{"showHide":"show","rules":[]}' WHERE enabled = 1`
		)
		await queryRunner.query(
			`UPDATE presets SET displayVariableLogic = '{"showHide":"hide","rules":[]}' WHERE enabled = 0`
		)
		await queryRunner.query(`UPDATE faders SET displayVariableLogic = '{"showHide":"show","rules":[]}'`)
		await queryRunner.query(`UPDATE folders SET displayVariableLogic = '{"showHide":"show","rules":[]}'`)
		await queryRunner.query(
			`CREATE TABLE "temporary_presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text, "variableLogic" text, "displayVariableLogic" text, "deviceId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_presets"("id", "name", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "variableLogic", "displayVariableLogic", "deviceId") SELECT "id", "name", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "variableLogic", "displayVariableLogic", "deviceId" FROM "presets"`
		)
		await queryRunner.query(`DROP TABLE "presets"`)
		await queryRunner.query(`ALTER TABLE "temporary_presets" RENAME TO "presets"`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "presets" RENAME TO "temporary_presets"`)
		await queryRunner.query(
			`CREATE TABLE "presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text, "variableLogic" text, "displayVariableLogic" text, "deviceId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "presets"("id", "name", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "variableLogic", "displayVariableLogic", "deviceId") SELECT "id", "name", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "variableLogic", "displayVariableLogic", "deviceId" FROM "temporary_presets"`
		)
		await queryRunner.query(`DROP TABLE "temporary_presets"`)
		await queryRunner.query(`ALTER TABLE "presets" RENAME TO "temporary_presets"`)
		await queryRunner.query(
			`CREATE TABLE "presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text)`
		)
		await queryRunner.query(
			`INSERT INTO "presets"("id", "name", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon") SELECT "id", "name", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon" FROM "temporary_presets"`
		)
		await queryRunner.query(`DROP TABLE "temporary_presets"`)
		await queryRunner.query(`ALTER TABLE "presets" RENAME TO "temporary_presets"`)
		await queryRunner.query(
			`CREATE TABLE "presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text)`
		)
		await queryRunner.query(
			`INSERT INTO "presets"("id", "name", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon") SELECT "id", "name", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon" FROM "temporary_presets"`
		)
		await queryRunner.query(`DROP TABLE "temporary_presets"`)
	}
}
