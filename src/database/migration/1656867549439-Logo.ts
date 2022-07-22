import { MigrationInterface, QueryRunner } from 'typeorm'
/**
 * Folders used to be known as "preset folders" because they were a bit of a last minute bolt on to v1.
 */
export class Logo1656867549439 implements MigrationInterface {
	name = 'Logo1656867549439'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO config (key, value) VALUES ('logoPath', 'false');`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
