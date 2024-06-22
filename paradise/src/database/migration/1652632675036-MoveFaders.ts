import { MigrationInterface, QueryRunner } from 'typeorm'

export class MoveFaders1652632675036 implements MigrationInterface {
	name = 'MoveFaders1652632675036'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO faders (id, name, channel, enabled, type, sort) SELECT id, name, channel, enabled, 'osc' AS type, '1' AS sort FROM sndFaders;`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
