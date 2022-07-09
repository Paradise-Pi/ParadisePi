import { MigrationInterface, QueryRunner } from 'typeorm'

export class ClearUpHelpText1654009120000 implements MigrationInterface {
	name = 'ClearUpHelpText1654009120000'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DELETE FROM config WHERE key='LXInfo';`)
		await queryRunner.query(`UPDATE config SET key='helpText' WHERE key='SNDInfo';`)
		await queryRunner.query(`UPDATE config SET key='e131Enabled' WHERE key='LXEnabled';`)
		await queryRunner.query(`UPDATE config SET key='OSCEnabled' WHERE key='SNDEnabled';`)
		await queryRunner.query(`UPDATE config SET key='adminLinkFromControlPanel' WHERE key='AdminEnabled';`)

		await queryRunner.query(`DELETE FROM config WHERE key='LXAdditonalMenu';`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
