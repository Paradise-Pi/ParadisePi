import { MigrationInterface, QueryRunner } from 'typeorm'

export class SimplifyConfig1652626978152 implements MigrationInterface {
	name = 'SimplifyConfig1652626978152'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "temporary_config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_config"("key", "value") SELECT "key", "value" FROM "config"`
		)
		await queryRunner.query(`DROP TABLE "config"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_config" RENAME TO "config"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_lxConfig"("key", "value") SELECT "key", "value" FROM "lxConfig"`
		)
		await queryRunner.query(`DROP TABLE "lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_lxConfig" RENAME TO "lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_sndConfig"("key", "value") SELECT "key", "value" FROM "sndConfig"`
		)
		await queryRunner.query(`DROP TABLE "sndConfig"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_sndConfig" RENAME TO "sndConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_config"("key", "value") SELECT "key", "value" FROM "config"`
		)
		await queryRunner.query(`DROP TABLE "config"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_config" RENAME TO "config"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_lxConfig"("key", "value") SELECT "key", "value" FROM "lxConfig"`
		)
		await queryRunner.query(`DROP TABLE "lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_lxConfig" RENAME TO "lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_sndConfig"("key", "value") SELECT "key", "value" FROM "sndConfig"`
		)
		await queryRunner.query(`DROP TABLE "sndConfig"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_sndConfig" RENAME TO "sndConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, CONSTRAINT "UQ_604248da1c13d8aaa1e145ffb83" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_config"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "config"`
		)
		await queryRunner.query(`DROP TABLE "config"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_config" RENAME TO "config"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, CONSTRAINT "UQ_3288e120d284d49f0824d4cabae" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_lxConfig"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "lxConfig"`
		)
		await queryRunner.query(`DROP TABLE "lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_lxConfig" RENAME TO "lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "temporary_sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, CONSTRAINT "UQ_cbce0e6f1c064caedc583e9f82e" UNIQUE ("key"))`
		)
		await queryRunner.query(
			`INSERT INTO "temporary_sndConfig"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "sndConfig"`
		)
		await queryRunner.query(`DROP TABLE "sndConfig"`)
		await queryRunner.query(
			`ALTER TABLE "temporary_sndConfig" RENAME TO "sndConfig"`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "sndConfig" RENAME TO "temporary_sndConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "sndConfig"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "temporary_sndConfig"`
		)
		await queryRunner.query(`DROP TABLE "temporary_sndConfig"`)
		await queryRunner.query(
			`ALTER TABLE "lxConfig" RENAME TO "temporary_lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "lxConfig"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "temporary_lxConfig"`
		)
		await queryRunner.query(`DROP TABLE "temporary_lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "config" RENAME TO "temporary_config"`
		)
		await queryRunner.query(
			`CREATE TABLE "config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "json" text, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
		await queryRunner.query(
			`INSERT INTO "config"("key", "value", "json", "createdAt", "updatedAt", "version") SELECT "key", "value", "json", "createdAt", "updatedAt", "version" FROM "temporary_config"`
		)
		await queryRunner.query(`DROP TABLE "temporary_config"`)
		await queryRunner.query(
			`ALTER TABLE "sndConfig" RENAME TO "temporary_sndConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL)`
		)
		await queryRunner.query(
			`INSERT INTO "sndConfig"("key", "value") SELECT "key", "value" FROM "temporary_sndConfig"`
		)
		await queryRunner.query(`DROP TABLE "temporary_sndConfig"`)
		await queryRunner.query(
			`ALTER TABLE "lxConfig" RENAME TO "temporary_lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL)`
		)
		await queryRunner.query(
			`INSERT INTO "lxConfig"("key", "value") SELECT "key", "value" FROM "temporary_lxConfig"`
		)
		await queryRunner.query(`DROP TABLE "temporary_lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "config" RENAME TO "temporary_config"`
		)
		await queryRunner.query(
			`CREATE TABLE "config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL)`
		)
		await queryRunner.query(
			`INSERT INTO "config"("key", "value") SELECT "key", "value" FROM "temporary_config"`
		)
		await queryRunner.query(`DROP TABLE "temporary_config"`)
		await queryRunner.query(
			`ALTER TABLE "sndConfig" RENAME TO "temporary_sndConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "sndConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "options" text, "canEdit" boolean NOT NULL DEFAULT (1))`
		)
		await queryRunner.query(
			`INSERT INTO "sndConfig"("key", "value") SELECT "key", "value" FROM "temporary_sndConfig"`
		)
		await queryRunner.query(`DROP TABLE "temporary_sndConfig"`)
		await queryRunner.query(
			`ALTER TABLE "lxConfig" RENAME TO "temporary_lxConfig"`
		)
		await queryRunner.query(
			`CREATE TABLE "lxConfig" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text)`
		)
		await queryRunner.query(
			`INSERT INTO "lxConfig"("key", "value") SELECT "key", "value" FROM "temporary_lxConfig"`
		)
		await queryRunner.query(`DROP TABLE "temporary_lxConfig"`)
		await queryRunner.query(
			`ALTER TABLE "config" RENAME TO "temporary_config"`
		)
		await queryRunner.query(
			`CREATE TABLE "config" ("key" text PRIMARY KEY NOT NULL, "value" text NOT NULL, "name" text NOT NULL, "description" text, "canEdit" boolean NOT NULL DEFAULT (1), "options" text)`
		)
		await queryRunner.query(
			`INSERT INTO "config"("key", "value") SELECT "key", "value" FROM "temporary_config"`
		)
		await queryRunner.query(`DROP TABLE "temporary_config"`)
	}
}
