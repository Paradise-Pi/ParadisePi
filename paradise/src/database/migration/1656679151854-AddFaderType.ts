import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFaderType1656679151854 implements MigrationInterface {
	name = 'AddFaderType1656679151854'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`UPDATE faders SET type='ch';`)
		await queryRunner.query(
			`ALTER TABLE faders
			ADD "folderId" integer`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
