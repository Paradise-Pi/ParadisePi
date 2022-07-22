import { MigrationInterface, QueryRunner } from 'typeorm'
/**
 * Folders used to be known as "preset folders" because they were a bit of a last minute bolt on to v1.
 */
export class Fullscreen1657356807729 implements MigrationInterface {
	name = 'Fullscreen1656867549439'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO config (key, value) VALUES ('fullscreen', 'false');`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
