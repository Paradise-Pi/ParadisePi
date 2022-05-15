import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSort1652632118557 implements MigrationInterface {
	name = 'AddSort1652632118557'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "presetFolders" ADD COLUMN  "sort" integer NOT NULL DEFAULT (1)`
		)
		await queryRunner.query(
			`ALTER TABLE "presets" ADD COLUMN  "sort" integer NOT NULL DEFAULT (1)`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(``)
	}
}
