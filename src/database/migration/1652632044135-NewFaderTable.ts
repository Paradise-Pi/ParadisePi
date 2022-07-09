import { MigrationInterface, QueryRunner } from 'typeorm'

export class NewFaderTable1652632044135 implements MigrationInterface {
	name = 'NewFaderTable1652632044135'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "faders" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "channel" integer, "enabled" boolean NOT NULL, "data" text, "type" text NOT NULL, "sort" integer NOT NULL, "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer)`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "faders"`)
	}
}
