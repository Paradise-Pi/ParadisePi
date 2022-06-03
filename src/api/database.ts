import { DatabasePreset, PresetRepository } from './../database/repository/preset'
import { DatabasePresetFolder, PresetFolderRepository } from './../database/repository/presetFolder'
import { ConfigRepository } from './../database/repository/config'
import { getOperatingSystemName } from './about/operatingSystem/info'
import { version } from './../../package.json'
import { broadcast } from './broadcast'
import ip from 'ip'

export interface Database {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
	about: {
		operatingSystem: {
			name: string
		}
		version: string
		ipAddress: string
		port: number
	}
	config: {
		general: {
			deviceLock: boolean
			timeoutTime: number
			helpText: string
			adminLinkFromControlPanel: boolean
		}
	}
	presets: Array<DatabasePreset>
	presetFolders: {
		[key: number]: DatabasePresetFolder
	}
}
/**
 * Create a new database object for monitoring by redux
 * @param message - The message to log alongside the database request - this is useful for debugging
 * @returns A promise that resolves to the database
 */
export const createDatabaseObject = async (message: string): Promise<Database> => {
	return {
		message,
		about: {
			operatingSystem: {
				name: getOperatingSystemName(),
			},
			version: version,
			ipAddress: ip.address(),
			port: 80, // TODO allow port changing
		},
		config: {
			general: {
				deviceLock: (await ConfigRepository.getItem('deviceLock')) === 'LOCKED',
				timeoutTime: parseInt(await ConfigRepository.getItem('timeoutTime')) * 1000,
				helpText: await ConfigRepository.getItem('helpText'),
				adminLinkFromControlPanel: (await ConfigRepository.getItem('adminLinkFromControlPanel')) === 'true',
			},
		},
		presets: await PresetRepository.getAll(),
		presetFolders: await PresetFolderRepository.getAll(),
	}
}
/**
 * Sends the database object over both channels to notify all clients of an update
 * @param database - The database object to send
 */
export const sendDatabaseObject = (database: Database): void => {
	broadcast('refreshDatabase', database)
}
