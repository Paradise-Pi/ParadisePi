import { MigrationInterface, QueryRunner } from 'typeorm'

export class ConsolidateConfigTables1652627450654
	implements MigrationInterface
{
	name = 'ConsolidateConfigTables1652627450654'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE lxConfig SET key='e131FadeTime' WHERE key = 'fadeTime'`
		)
		await queryRunner.query(
			`UPDATE sndConfig SET key='OSCTargetIP' WHERE key = 'targetIP'`
		)
		await queryRunner.query(
			`UPDATE sndConfig SET key='OSCMixerType' WHERE key = 'mixer'`
		)
		await queryRunner.query(
			`INSERT INTO config
            SELECT * FROM lxConfig`
		)
		await queryRunner.query(
			`INSERT INTO config
            SELECT * FROM sndConfig`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
