import { DatabasePreset, PresetRepository } from './../database/repository/preset'
import { DatabaseFolder, FolderRepository } from './../database/repository/folder'
import { ConfigRepository } from './../database/repository/config'
import { getOperatingSystemName } from './about/operatingSystem/info'
import { version } from './../../package.json'
import { broadcast } from './broadcast'
import ip from 'ip'
import { DatabaseFader, FaderRepository } from './../database/repository/fader'

export interface Database {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
	about: {
		operatingSystem: {
			name: string
		}
		version: string
		ipAddress: string
		port: number | false
	}
	config: {
		general: {
			deviceLock: boolean
			timeoutTime: number
			helpText: string
			adminLinkFromControlPanel: boolean
			adminPin: string
			remotePassword: string
			fullscreen: boolean
		}
		osc: {
			OSCTargetIP: string
			OSCMixerType: string
			OSCEnabled: boolean
		}
		e131: {
			e131Enabled: boolean
			e131FirstUniverse: number
			e131Universes: number
			e131SourceName: string
			e131Priority: number
			e131Frequency: number
			e131FadeTime: number
			e131Sampler_time: number
			e131Sampler_effectMode: number
		}
	}
	presets: Array<DatabasePreset>
	folders: {
		[key: number]: DatabaseFolder
	}
	faders: Array<DatabaseFader>
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
			port: globalThis.port,
		},
		config: {
			general: {
				deviceLock: (await ConfigRepository.getItem('deviceLock')) === 'LOCKED',
				timeoutTime: parseInt(await ConfigRepository.getItem('timeoutTime')) * 1000,
				helpText: await ConfigRepository.getItem('helpText'),
				adminLinkFromControlPanel: (await ConfigRepository.getItem('adminLinkFromControlPanel')) === 'true',
				adminPin: await ConfigRepository.getItem('adminPin'),
				remotePassword: await ConfigRepository.getItem('remotePassword'),
				fullscreen: (await ConfigRepository.getItem('fullscreen')) === 'true',
			},
			osc: {
				OSCTargetIP: await ConfigRepository.getItem('OSCTargetIP'),
				OSCMixerType: await ConfigRepository.getItem('OSCMixerType'),
				OSCEnabled: (await ConfigRepository.getItem('OSCEnabled')) === 'true',
			},
			e131: {
				e131Enabled: (await ConfigRepository.getItem('e131Enabled')) === 'true',
				e131FirstUniverse: parseInt(await ConfigRepository.getItem('e131FirstUniverse')),
				e131Universes: parseInt(await ConfigRepository.getItem('e131Universes')),
				e131SourceName: await ConfigRepository.getItem('e131SourceName'),
				e131Priority: parseInt(await ConfigRepository.getItem('e131Priority')),
				e131Frequency: parseInt(await ConfigRepository.getItem('e131Frequency')),
				e131FadeTime: parseInt(await ConfigRepository.getItem('e131FadeTime')),
				e131Sampler_time: parseInt(await ConfigRepository.getItem('e131Sampler_time')),
				e131Sampler_effectMode: parseInt(await ConfigRepository.getItem('e131Sampler_effectMode')),
			},
		},
		presets: await PresetRepository.getAll(),
		folders: await FolderRepository.getAll(),
		faders: await FaderRepository.getAll(),
	}
}
/**
 * Sends the database object over both channels to notify all clients of an update
 * @param database - The database object to send
 */
export const sendDatabaseObject = (database: Database): void => {
	broadcast('refreshDatabase', database)
}
