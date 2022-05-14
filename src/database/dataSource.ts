import 'reflect-metadata'
import { DataSource } from 'typeorm'
import path from 'path'

/**
 * Manually import each of the models/migrations because otherwise Webpack doesn't spot them
 */
import { Config } from './model/Config'
import { LxConfig } from './model/LxConfig'
import { LxPreset } from './model/LxPreset'
import { LxPresetFolders } from './model/LxPresetFolders'
import { SndConfig } from './model/SndConfig'
import { SndFaders } from './model/SndFaders'
import { SndPreset } from './model/SndPreset'
import { Initial1650709558593 } from './migration/1650709558593-Initial'
import { InsertConfig1650710286405 } from './migration/1650710286405-InsertConfig'

const dataSource = new DataSource({
	type: 'better-sqlite3',
	database: path.join(__dirname, '../../database.sqlite'),
	synchronize: false,
	migrationsRun: true,
	entities: [
		Config,
		LxConfig,
		LxPreset,
		LxPresetFolders,
		SndConfig,
		SndFaders,
		SndPreset,
	],
	migrations: [Initial1650709558593, InsertConfig1650710286405],
	subscribers: [],
})
export default dataSource
