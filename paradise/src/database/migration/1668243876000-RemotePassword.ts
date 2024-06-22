import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemotePassword1668243876000 implements MigrationInterface {
	name = 'RemotePassword1668243876000'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO config (key, value) VALUES ('remotePassword', '');`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
