import { MigrationInterface, QueryRunner } from 'typeorm'

export class PresetIcons1686849999231 implements MigrationInterface {
	name = 'PresetIcons1686849999231'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE presets
			ADD "icon" text`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
