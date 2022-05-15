import { WebServer } from './../webServer'
import { getOperatingSystemName } from './about/operatingSystem/info'

export interface Database {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
	about: {
		operatingSystem: {
			name: string
		}
	}
}

export const createDatabaseObject = (message: string): Database => {
	return {
		message,
		about: {
			operatingSystem: {
				name: getOperatingSystemName(),
			},
		},
	}
}

export const sendDatabaseObject = (database: Database): void => {
	mainBrowserWindow.webContents.send('refreshDatabase', database)
	WebServer.socketIo.emit('refreshDatabase', database)
}
