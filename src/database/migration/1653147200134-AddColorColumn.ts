import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddColorColumn1653147200134 implements MigrationInterface {
	name = 'AddColorColumn1653147200134'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE presets
			ADD "color" text`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
