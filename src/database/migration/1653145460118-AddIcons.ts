import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIcons1653145460118 implements MigrationInterface {
	name = 'AddIcons1653145460118'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE presetFolders
			ADD "icon" text`
		)

		await queryRunner.query(`INSERT INTO presetFolders (name, sort, icon) VALUES ('Lighting', 1, 'FaRegLightbulb')`)
		await queryRunner.query(`INSERT INTO presetFolders (name, sort, icon) VALUES ('Sound', 2, 'FaVolumeUp')`)
		await queryRunner.query(`INSERT INTO presetFolders (name, sort, icon) VALUES ('Projection', 3, 'FaVideo')`)
		await queryRunner.query(
			`UPDATE presets SET folderId = (SELECT id FROM presetFolders WHERE name = 'Lighting' LIMIT 1) WHERE folderId IS NULL`
		) // Migrate any presets without a folder to the Lighting folder
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
