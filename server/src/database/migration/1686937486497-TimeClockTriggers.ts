import { MigrationInterface, QueryRunner } from 'typeorm'

export class TimeClockTriggers1686937486497 implements MigrationInterface {
	name = 'TimeClockTriggers1686937486497'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "timeclocktriggers" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "time" text NOT NULL, "notes" text, "lastTriggered" integer NOT NULL DEFAULT (0), "enabled" boolean NOT NULL DEFAULT (1), "enabledWhenLocked" boolean NOT NULL DEFAULT (1), "timeout" integer NOT NULL DEFAULT (0), "countdownWarning" integer NOT NULL DEFAULT (0), "countdownWarningText" text, "mon" boolean NOT NULL DEFAULT (1), "tues" boolean NOT NULL DEFAULT (1), "weds" boolean NOT NULL DEFAULT (1), "thurs" boolean NOT NULL DEFAULT (1), "fri" boolean NOT NULL DEFAULT (1), "sat" boolean NOT NULL DEFAULT (1), "sun" boolean NOT NULL DEFAULT (1), "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')), "version" integer, "presetId" integer)`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "timeclocktriggers"`)
	}
}
