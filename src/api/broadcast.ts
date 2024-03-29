import { WebServer } from './../webServer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const broadcast = (channel: string, data: { [key: string]: any }): void => {
	mainBrowserWindow.webContents.send(channel, data)
	WebServer.socketIo.emit(channel, data)
}
