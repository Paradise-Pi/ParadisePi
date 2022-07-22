import { MigrationInterface, QueryRunner } from 'typeorm'

export class MovePresetsAcross1652628929444 implements MigrationInterface {
	name = 'MovePresetsAcross1652628929444'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO presets (name, data, type) SELECT name, data, 'osc' AS type FROM sndPreset;`
		)
		await queryRunner.query(
			`INSERT INTO presetFolders (id, name, parentId) SELECT id, name, parentId FROM lxPresetFolders;`
		)
		await queryRunner.query(
			`INSERT INTO presets (name, enabled, universe, data, fadeTime, folderId, type) SELECT name, enabled, universe, setArguments, fadeTime, folderId, 'e131' AS type FROM lxPreset;`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
