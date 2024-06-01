import { MigrationInterface, QueryRunner } from 'typeorm'
/**
 * Generate default config - it will respect existing config
 */
export class InsertConfig1650710286405 implements MigrationInterface {
	name = 'InsertConfig1650710286405'

	public async up(queryRunner: QueryRunner): Promise<void> {
		let count = await queryRunner.query(`SELECT COUNT(*) as count FROM lxConfig WHERE key = 'e131FirstUniverse';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO lxConfig (key, value, name) VALUES ('e131FirstUniverse', '1', 'First Universe');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM lxConfig WHERE key = 'e131Universes';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO lxConfig (key, value, name) VALUES ('e131Universes', '2', 'Number of Universes');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM lxConfig WHERE key = 'e131SourceName';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO lxConfig (key, value, name) VALUES ('e131SourceName', 'Paradise Pi', 'sACN Source Name');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM lxConfig WHERE key = 'e131Priority';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO lxConfig (key, value, name) VALUES ('e131Priority', '25', 'sACN Priority');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM lxConfig WHERE key = 'e131Frequency';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO lxConfig (key, value, name) VALUES ('e131Frequency', '5', 'Refresh Rate');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM lxConfig WHERE key = 'fadeTime';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO lxConfig (key, value, name) VALUES ('fadeTime', '5', 'Preset Fade Time');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM lxConfig WHERE key = 'e131Sampler_time';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO lxConfig (key, value, name) VALUES ('e131Sampler_time', '15', 'Sampler Mode run time');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM lxConfig WHERE key = 'e131Sampler_effectMode';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO lxConfig (key, value, name) VALUES ('e131Sampler_effectMode', '0', 'Sampler Mode effect mode enable');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM sndConfig WHERE key = 'targetIP';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO sndConfig (key, value, name) VALUES ('targetIP', '192.168.1.1', 'OSC Target IP');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM sndConfig WHERE key = 'mixer';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO sndConfig (key, value, name) VALUES ('mixer', 'xair', 'Console Type');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM config WHERE key = 'deviceLock';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO config (key, value, name) VALUES ('deviceLock', 'UNLOCKED', 'Device Lock');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM config WHERE key = 'timeoutTime';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO config (key, value, name) VALUES ('timeoutTime','120', 'Device Timeout');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM config WHERE key = 'LXInfo';`)
		if (count[0].count < 1) {
			await queryRunner.query(`INSERT INTO config (key, value, name) VALUES ('LXInfo','', 'LX Additional Info');`)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM config WHERE key = 'SNDInfo';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO config (key, value, name) VALUES ('SNDInfo','', 'SND Additional Info');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM config WHERE key = 'LXEnabled';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO config (key, value, name) VALUES ('LXEnabled','true', 'Lighting Page');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM config WHERE key = 'LXAdditonalMenu';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO config (key, value, name) VALUES ('LXAdditonalMenu','true', 'Lighting Special Functions');`
			)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM config WHERE key = 'SNDEnabled';`)
		if (count[0].count < 1) {
			await queryRunner.query(`INSERT INTO config (key, value, name) VALUES ('SNDEnabled','true', 'Sound Page');`)
		}
		count = await queryRunner.query(`SELECT COUNT(*) as count FROM config WHERE key = 'AdminEnabled';`)
		if (count[0].count < 1) {
			await queryRunner.query(
				`INSERT INTO config (key, value, name) VALUES ('AdminEnabled','true', 'Admin Page');`
			)
		}
	}

	public async down(): Promise<void> {
		// Not much need to roll this one back
	}
}
