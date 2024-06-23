import ip from 'ip'
import { Database } from '../../../shared/database'
import { version } from '../../package.json'
import { ConfigRepository } from '../database/repository/config'
import { FaderRepository } from '../database/repository/fader'
import { FolderRepository } from '../database/repository/folder'
import { PresetRepository } from '../database/repository/preset'
import { TimeClockTriggersRepository } from '../database/repository/timeClockTrigger'
import { WebServer } from '../webServer'
import { getOperatingSystemName } from './about/operatingSystem/info'
import { broadcast } from './broadcast'

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
			port: WebServer.port,
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
			},
		},
		presets: await PresetRepository.getAll(),
		timeClockTriggers: await TimeClockTriggersRepository.getAll(),
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
