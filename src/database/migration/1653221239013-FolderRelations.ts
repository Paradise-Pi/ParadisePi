import { MigrationInterface, QueryRunner } from 'typeorm'

export class FolderRelations1653221239013 implements MigrationInterface {
	name = 'FolderRelations1653221239013'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "temporary_presetFolders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "parentId" integer, "sort" integer NOT NULL DEFAULT (1), "icon" text)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_presetFolders"("id", "name", "createdAt", "updatedAt", "version", "parentId", "sort", "icon") SELECT "id", "name", "createdAt", "updatedAt", "version", "parentId", "sort", "icon" FROM "presetFolders"`
		)
		await queryRunner.query(`DROP TABLE "presetFolders"`)
		await queryRunner.query(`ALTER TABLE "temporary_presetFolders" RENAME TO "presetFolders"`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "presetFolders" RENAME TO "temporary_presetFolders"`)
		await queryRunner.query(
			`CREATE TABLE "presetFolders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "parentId" integer, "sort" integer NOT NULL DEFAULT (1), "icon" text)`
		)
		await queryRunner.query(
			`INSERT INTO "presetFolders"("id", "name", "createdAt", "updatedAt", "version", "parentId", "sort", "icon") SELECT "id", "name", "createdAt", "updatedAt", "version", "parentId", "sort", "icon" FROM "temporary_presetFolders"`
		)
		await queryRunner.query(`DROP TABLE "temporary_presetFolders"`)
	}
}
