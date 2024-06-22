import { MigrationInterface, QueryRunner } from 'typeorm'
/**
 * Folders used to be known as "preset folders" because they were a bit of a last minute bolt on to v1.
 */
export class PresetFoldersToFolders1656681029002 implements MigrationInterface {
	name = 'PresetFoldersToFolders1656681029002'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE presetFolders RENAME TO folders;`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
