import { MigrationInterface, QueryRunner } from 'typeorm'

export class History1720262576000 implements MigrationInterface {
	name = 'History1720262576000'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO config (key, value) VALUES ('historyEnabled', 'false');`)
		await queryRunner.query(`INSERT INTO config (key, value) VALUES ('historyLogParameters', '');`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
