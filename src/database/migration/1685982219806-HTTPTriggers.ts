import { MigrationInterface, QueryRunner } from 'typeorm'

export class HTTPTriggers1685982219806 implements MigrationInterface {
	name = 'HTTPTriggers1685982219806'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE presets
			ADD "httpTriggerEnabled" boolean NOT NULL DEFAULT (0)`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
