import { MigrationInterface, QueryRunner } from 'typeorm'

export class DropTables1652632685655 implements MigrationInterface {
	name = 'DropTables1652632685655'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS lxConfig`)
		await queryRunner.query(`DROP TABLE IF EXISTS lxPreset`)
		await queryRunner.query(`DROP TABLE IF EXISTS lxPresetFolders`)
		await queryRunner.query(`DROP TABLE IF EXISTS sndConfig`)
		await queryRunner.query(`DROP TABLE IF EXISTS sndFaders`)
		await queryRunner.query(`DROP TABLE IF EXISTS sndPreset`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
