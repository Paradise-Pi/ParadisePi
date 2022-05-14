import { WebServer } from './../webServer'

export interface Database {
	[key: string]: any
}

export const createDatabaseObject = (message: string): Database => {
	return {
		message,
	}
}

export const sendDatabaseObject = (database: Database): void => {
	mainBrowserWindow.webContents.send('refreshDatabase', database)
	WebServer.socketIo.emit('refreshDatabase', database)
}
