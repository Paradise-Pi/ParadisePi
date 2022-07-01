import 'reflect-metadata'
import { DataSource } from 'typeorm'
import path from 'path'

/**
 * Manually import each of the models/migrations because otherwise Webpack doesn't spot them
 */
import { Config } from './model/Config'
import { Preset } from './model/Preset'
import { Fader } from './model/Faders'
import { Folders } from './model/Folders'
import { MyCustomLogger } from './logger'

import { Initial1650709558593 } from './migration/1650709558593-Initial'
import { InsertConfig1650710286405 } from './migration/1650710286405-InsertConfig'
import { SimplifyConfig1652626978152 } from './migration/1652626978152-SimplifyConfig'
import { ConsolidateConfigTables1652627450654 } from './migration/1652627450654-ConsolidateConfigTables'
import { NewPresetTables1652628740334 } from './migration/1652628740334-NewPresetTables'
import { MovePresetsAcross1652628929444 } from './migration/1652628929444-MovePresetsAcross'
import { NewFaderTable1652632044135 } from './migration/1652632044135-NewFaderTable'
import { AddSort1652632118557 } from './migration/1652632118557-AddSort'
import { MoveFaders1652632675036 } from './migration/1652632675036-MoveFaders'
import { DropTables1652632685655 } from './migration/1652632685655-DropTables'
import { AddIcons1653145460118 } from './migration/1653145460118-AddIcons'
import { AddColorColumn1653147200134 } from './migration/1653147200134-AddColorColumn'
import { FolderRelations1653221239013 } from './migration/1653221239013-FolderRelations'
import { ClearUpHelpText1654009120000 } from './migration/1654009120000-ClearUpHelpText'
import { AddFolderText1655564727255 } from './migration/1655564727255-AddFolderText'
import { AddFaderType1656679151854 } from './migration/1656679151854-AddFaderType'
import { PresetFoldersToFolders1656681029002 } from './migration/1656681029002-PresetFoldersToFolders'

const dataSource = new DataSource({
	type: 'better-sqlite3',
	database: path.join(__dirname, '../../database.sqlite'),
	synchronize: false,
	migrationsRun: true,
	cache: false,
	entities: [Config, Preset, Folders, Preset, Fader],
	migrations: [
		Initial1650709558593,
		InsertConfig1650710286405,
		SimplifyConfig1652626978152,
		ConsolidateConfigTables1652627450654,
		NewPresetTables1652628740334,
		MovePresetsAcross1652628929444,
		NewFaderTable1652632044135,
		AddSort1652632118557,
		MoveFaders1652632675036,
		DropTables1652632685655,
		AddIcons1653145460118,
		AddColorColumn1653147200134,
		FolderRelations1653221239013,
		ClearUpHelpText1654009120000,
		AddFolderText1655564727255,
		AddFaderType1656679151854,
		PresetFoldersToFolders1656681029002,
	],
	subscribers: [],
	logger: new MyCustomLogger(),
})
export default dataSource
