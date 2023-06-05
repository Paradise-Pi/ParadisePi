import { MigrationInterface, QueryRunner } from 'typeorm'

export class ScheduledPresets1685981931584 implements MigrationInterface {
	name = 'ScheduledPresets1685981931584'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE presets
			ADD "timeClockTriggers" text`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
