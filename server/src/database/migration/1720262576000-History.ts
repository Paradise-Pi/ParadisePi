import { MigrationInterface, QueryRunner } from 'typeorm'

export class History1720262576000 implements MigrationInterface {
	name = 'History1720262576000'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO config (key, value) VALUES ('historyEnabled', 'false');`)
		await queryRunner.query(
			`INSERT INTO config (key, value) VALUES ('historyLogParameters', 'e131-value,http-trigger-preset,osc-fader,http-trigger-preset-fail,preset,preset-internal,preset-timeclocktrigger');`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
