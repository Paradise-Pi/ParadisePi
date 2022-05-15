import { MigrationInterface, QueryRunner } from 'typeorm'

export class NewPresetTables1652628740334 implements MigrationInterface {
	name = 'NewPresetTables1652628740334'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "presetFolders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "parentId" integer)`
		)
		await queryRunner.query(
			`CREATE TABLE "presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer)`
		)

		await queryRunner.query(
			`CREATE TABLE "temporary_presetFolders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "parentId" integer, CONSTRAINT "FK_ce404f5238d6f7c7691e4691393" FOREIGN KEY ("parentId") REFERENCES "presetFolders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_presetFolders"("id", "name", "createdAt", "updatedAt", "version", "parentId") SELECT "id", "name", "createdAt", "updatedAt", "version", "parentId" FROM "presetFolders"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "presetFolders"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_presetFolders" RENAME TO "presetFolders"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_presets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "enabled" boolean NOT NULL DEFAULT (1), "type" text, "universe" text, "fadeTime" integer DEFAULT (0), "data" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "folderId" integer, CONSTRAINT "FK_275d0ba86b9663cd53f30cc86f7" FOREIGN KEY ("folderId") REFERENCES "presetFolders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_presets"("id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId") SELECT "id", "name", "enabled", "type", "universe", "fadeTime", "data", "createdAt", "updatedAt", "version", "folderId" FROM "presets"`
		)
		await queryRunner.query(`DROP TABLE IF EXISTS "presets"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_presets" RENAME TO "presets"`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS "presets"`)
		await queryRunner.query(`DROP TABLE IF EXISTS "presetFolders"`)
	}
}
