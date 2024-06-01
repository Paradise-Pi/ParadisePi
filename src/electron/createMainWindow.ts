import { BrowserWindow, Menu, session } from 'electron'
import path from 'path'
import 'reflect-metadata'
import { isRunningInDevelopmentMode } from './developmentMode'
import { mainWindowTemplate } from './menuBar'

export default (startPath: string, fullscreen?: boolean): BrowserWindow => {
	const window = new BrowserWindow({
		height: 519, // Equates to 480 when you knock off the menu bar
		width: 816, // Equates to 800 when you knock off the menu bar
		fullscreen: process.env.FULLSCREEN && process.env.FULLSCREEN == 'true' ? true : fullscreen ?? false, // Environment variable is the priority, followed by the variable passed to the function
		title: 'Paradise',
		icon: path.join(__dirname, '/../../icon/icon.png'),
		webPreferences: {
			nodeIntegration: false, // disabled node.js on the frontend
			contextIsolation: true, // protect against prototype pollution
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	if (process.platform === 'darwin') {
		// A menu of some kind is required on MacOS
		const menu = Menu.buildFromTemplate(mainWindowTemplate)
		Menu.setApplicationMenu(menu)
	} else {
		Menu.setApplicationMenu(null)
	}

	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '#' + startPath)
	} else {
		window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html#${startPath}`))
	}

	if (isRunningInDevelopmentMode) window.webContents.openDevTools()

	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': ["default-src 'self' 'unsafe-eval' 'unsafe-inline' data:;"],
			},
		})
	})

	return window
}
