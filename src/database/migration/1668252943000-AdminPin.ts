import { MigrationInterface, QueryRunner } from 'typeorm'

export class AdminPin1668252943000 implements MigrationInterface {
	name = 'AdminPin1668252943000'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO config (key, value) VALUES ('adminPin', '');`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
