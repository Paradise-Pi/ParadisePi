import { DatabasePreset, PresetRepository } from './../database/repository/preset'
import { DatabasePresetFolder, PresetFolderRepository } from './../database/repository/presetFolder'
import { WebServer } from './../webServer'
import { getOperatingSystemName } from './about/operatingSystem/info'
import { version } from './../../package.json'

export interface Database {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
	about: {
		operatingSystem: {
			name: string
		}
		version: string
	}
	presets: Array<DatabasePreset>
	presetFolders: Array<DatabasePresetFolder>
	folders: {
		topLevelFolders: Array<DatabasePresetFolder>
	}
}

export const createDatabaseObject = async (message: string): Promise<Database> => {
	return {
		message,
		about: {
			operatingSystem: {
				name: getOperatingSystemName(),
			},
			version: version,
		},
		presets: await PresetRepository.getAll(),
		presetFolders: await PresetFolderRepository.getAll(),
		folders: {
			topLevelFolders: await PresetFolderRepository.getTopLevelFolders(),
		},
	}
}

export const sendDatabaseObject = (database: Database): void => {
	mainBrowserWindow.webContents.send('refreshDatabase', database)
	WebServer.socketIo.emit('refreshDatabase', database)
}
