import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFolderText1655564727255 implements MigrationInterface {
	name = 'AddFolderText1655564727255'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE presetFolders
			ADD "infoText" text`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
