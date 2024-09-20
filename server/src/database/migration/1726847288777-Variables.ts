import { MigrationInterface, QueryRunner } from 'typeorm'

export class Variables1726847288777 implements MigrationInterface {
	name = 'Variables1726847288777'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "temporary_config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_config"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "config"`
		)
		await queryRunner.query(`DROP TABLE "config"`)
		await queryRunner.query(`ALTER TABLE "temporary_config" RENAME TO "config"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_faders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "channel" integer, "enabled" boolean NOT NULL, "data" text, "type" text NOT NULL, "sort" integer NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_faders"("id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId") SELECT "id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId" FROM "faders"`
		)
		await queryRunner.query(`DROP TABLE "faders"`)
		await queryRunner.query(`ALTER TABLE "temporary_faders" RENAME TO "faders"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_devices" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "ip" text, "port" integer DEFAULT (80), "endpoint" text, "statusCheckPath" text, "statusCheckString" text, "notes" text, "sort" integer NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_devices"("id", "name", "ip", "endpoint", "statusCheckPath", "statusCheckString", "notes", "sort", "createdAt", "updatedAt", "version") SELECT "id", "name", "ip", "endpoint", "statusCheckPath", "statusCheckString", "notes", "sort", "createdAt", "updatedAt", "version" FROM "devices"`
		)
		await queryRunner.query(`DROP TABLE "devices"`)
		await queryRunner.query(`ALTER TABLE "temporary_devices" RENAME TO "devices"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text, "variableLogic" text, "deviceId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon" FROM "presets"`
		)
		await queryRunner.query(`DROP TABLE "presets"`)
		await queryRunner.query(`ALTER TABLE "temporary_presets" RENAME TO "presets"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, CONSTRAINT "UQ_604248da1c13d8aaa1e145ffb83" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_config"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "config"`
		)
		await queryRunner.query(`DROP TABLE "config"`)
		await queryRunner.query(`ALTER TABLE "temporary_config" RENAME TO "config"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_timeclocktriggers" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" text NOT NULL, "notes" text, "lastTriggered" integer NOT NULL DEFAULT (0), "enabled" boolean NOT NULL DEFAULT (1), "enabledWhenLocked" boolean NOT NULL DEFAULT (1), "timeout" integer NOT NULL DEFAULT (5), "countdownWarning" integer NOT NULL DEFAULT (0), "countdownWarningText" text, "mon" boolean NOT NULL DEFAULT (1), "tues" boolean NOT NULL DEFAULT (1), "weds" boolean NOT NULL DEFAULT (1), "thurs" boolean NOT NULL DEFAULT (1), "fri" boolean NOT NULL DEFAULT (1), "sat" boolean NOT NULL DEFAULT (1), "sun" boolean NOT NULL DEFAULT (1), "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "presetId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_timeclocktriggers"("id", "time", "notes", "lastTriggered", "enabled", "enabledWhenLocked", "timeout", "countdownWarning", "countdownWarningText", "mon", "tues", "weds", "thurs", "fri", "sat", "sun", "createdAt", "updatedAt", "version", "presetId") SELECT "id", "time", "notes", "lastTriggered", "enabled", "enabledWhenLocked", "timeout", "countdownWarning", "countdownWarningText", "mon", "tues", "weds", "thurs", "fri", "sat", "sun", "createdAt", "updatedAt", "version", "presetId" FROM "timeclocktriggers"`
		)
		await queryRunner.query(`DROP TABLE "timeclocktriggers"`)
		await queryRunner.query(`ALTER TABLE "temporary_timeclocktriggers" RENAME TO "timeclocktriggers"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text, "variableLogic" text, "deviceId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "variableLogic", "deviceId") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "variableLogic", "deviceId" FROM "presets"`
		)
		await queryRunner.query(`DROP TABLE "presets"`)
		await queryRunner.query(`ALTER TABLE "temporary_presets" RENAME TO "presets"`)
		await queryRunner.query(`DROP TABLE "temporary_folders"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "parentId" integer, "sort" integer NOT NULL DEFAULT (1), "icon" text, "infoText" text)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_folders"("id", "name", "createdAt", "updatedAt", "version", "parentId", "sort", "icon", "infoText") SELECT "id", "name", "createdAt", "updatedAt", "version", "parentId", "sort", "icon", "infoText" FROM "folders"`
		)
		await queryRunner.query(`DROP TABLE "folders"`)
		await queryRunner.query(`ALTER TABLE "temporary_folders" RENAME TO "folders"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_faders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "channel" integer NOT NULL, "enabled" boolean NOT NULL, "data" text, "type" text NOT NULL, "sort" integer NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_faders"("id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId") SELECT "id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId" FROM "faders"`
		)
		await queryRunner.query(`DROP TABLE "faders"`)
		await queryRunner.query(`ALTER TABLE "temporary_faders" RENAME TO "faders"`)

		await queryRunner.query(
			`CREATE TABLE "variables" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "value" text NOT NULL, "notes" text, "sort" integer NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)

		await queryRunner.query(
			`CREATE TABLE "temporary_presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text, "variableLogic" text, "displayVariableLogic" text, "deviceId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon" FROM "presets"`
		)
		await queryRunner.query(`DROP TABLE "presets"`)
		await queryRunner.query(`ALTER TABLE "temporary_presets" RENAME TO "presets"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_faders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "channel" integer, "enabled" boolean NOT NULL, "data" text, "type" text NOT NULL, "sort" integer NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "displayVariableLogic" text)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_faders"("id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId") SELECT "id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId" FROM "faders"`
		)
		await queryRunner.query(`DROP TABLE "faders"`)
		await queryRunner.query(`ALTER TABLE "temporary_faders" RENAME TO "faders"`)
		await queryRunner.query(
			`CREATE TABLE "temporary_config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, CONSTRAINT "UQ_604248da1c13d8aaa1e145ffb83" UNIQUE ("key"))`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "faders" RENAME TO "temporary_faders"`)
		await queryRunner.query(
			`CREATE TABLE "faders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "channel" integer, "enabled" boolean NOT NULL, "data" text, "type" text NOT NULL, "sort" integer NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "faders"("id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId") SELECT "id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId" FROM "temporary_faders"`
		)
		await queryRunner.query(`DROP TABLE "temporary_faders"`)
		await queryRunner.query(`ALTER TABLE "folders" RENAME TO "temporary_folders"`)
		await queryRunner.query(
			`CREATE TABLE "folders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "parentId" integer, "sort" integer NOT NULL DEFAULT (1), "icon" text, "infoText" text)`
		)
		await queryRunner.query(
			`INSERT INTO "folders"("id", "name", "createdAt", "updatedAt", "version", "parentId", "sort", "icon", "infoText") SELECT "id", "name", "createdAt", "updatedAt", "version", "parentId", "sort", "icon", "infoText" FROM "temporary_folders"`
		)
		await queryRunner.query(`DROP TABLE "temporary_folders"`)
		await queryRunner.query(`ALTER TABLE "presets" RENAME TO "temporary_presets"`)
		await queryRunner.query(
			`CREATE TABLE "presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text, "variableLogic" text, "deviceId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "variableLogic", "deviceId") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon", "variableLogic", "deviceId" FROM "temporary_presets"`
		)
		await queryRunner.query(`DROP TABLE "temporary_presets"`)
		await queryRunner.query(`ALTER TABLE "timeclocktriggers" RENAME TO "temporary_timeclocktriggers"`)
		await queryRunner.query(
			`CREATE TABLE "timeclocktriggers" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" text NOT NULL, "notes" text, "lastTriggered" integer NOT NULL DEFAULT (0), "enabled" boolean NOT NULL DEFAULT (1), "enabledWhenLocked" boolean NOT NULL DEFAULT (1), "timeout" integer NOT NULL DEFAULT (0), "countdownWarning" integer NOT NULL DEFAULT (0), "countdownWarningText" text, "mon" boolean NOT NULL DEFAULT (1), "tues" boolean NOT NULL DEFAULT (1), "weds" boolean NOT NULL DEFAULT (1), "thurs" boolean NOT NULL DEFAULT (1), "fri" boolean NOT NULL DEFAULT (1), "sat" boolean NOT NULL DEFAULT (1), "sun" boolean NOT NULL DEFAULT (1), "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "presetId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "timeclocktriggers"("id", "time", "notes", "lastTriggered", "enabled", "enabledWhenLocked", "timeout", "countdownWarning", "countdownWarningText", "mon", "tues", "weds", "thurs", "fri", "sat", "sun", "createdAt", "updatedAt", "version", "presetId") SELECT "id", "time", "notes", "lastTriggered", "enabled", "enabledWhenLocked", "timeout", "countdownWarning", "countdownWarningText", "mon", "tues", "weds", "thurs", "fri", "sat", "sun", "createdAt", "updatedAt", "version", "presetId" FROM "temporary_timeclocktriggers"`
		)
		await queryRunner.query(`DROP TABLE "temporary_timeclocktriggers"`)
		await queryRunner.query(`ALTER TABLE "config" RENAME TO "temporary_config"`)
		await queryRunner.query(
			`CREATE TABLE "config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "config"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "temporary_config"`
		)
		await queryRunner.query(`DROP TABLE "temporary_config"`)
		await queryRunner.query(`ALTER TABLE "presets" RENAME TO "temporary_presets"`)
		await queryRunner.query(
			`CREATE TABLE "presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, "sort" integer NOT NULL DEFAULT (1), "color" text, "httpTriggerEnabled" boolean NOT NULL DEFAULT (0), "icon" text)`
		)
		await queryRunner.query(
			`INSERT INTO "presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId", "sort", "color", "httpTriggerEnabled", "icon" FROM "temporary_presets"`
		)
		await queryRunner.query(`DROP TABLE "temporary_presets"`)
		await queryRunner.query(`DROP TABLE "devices"`)
		await queryRunner.query(`ALTER TABLE "faders" RENAME TO "temporary_faders"`)
		await queryRunner.query(
			`CREATE TABLE "faders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "channel" integer, "enabled" boolean NOT NULL, "data" text, "type" text NOT NULL, "sort" integer NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "faders"("id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId") SELECT "id", "name", "channel", "enabled", "data", "type", "sort", "createdAt", "updatedAt", "version", "folderId" FROM "temporary_faders"`
		)
		await queryRunner.query(`DROP TABLE "temporary_faders"`)
		await queryRunner.query(`ALTER TABLE "config" RENAME TO "temporary_config"`)
		await queryRunner.query(
			`CREATE TABLE "config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "config"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "temporary_config"`
		)
		await queryRunner.query(`DROP TABLE "temporary_config"`)

		await queryRunner.query(`DROP TABLE "variables"`)
	}
}
