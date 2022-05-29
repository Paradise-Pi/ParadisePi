import { BrowserWindow, session, Menu } from 'electron'
import 'reflect-metadata'
import { mainWindowTemplate } from './menuBar'
import path from 'path'

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

export default (startPath: string, fullscreen?: boolean): BrowserWindow => {
	const window = new BrowserWindow({
		height: 519, // Equates to 480 when you knock off the menu bar
		width: 816, // Equates to 800 when you knock off the menu bar
		minWidth: 800,
		minHeight: 480,
		fullscreen: fullscreen ?? false,
		title: 'Paradise',
		icon: path.join(__dirname, '/../../icon/icon.png'),
		webPreferences: {
			nodeIntegration: false, // disabled node.js on the frontend
			contextIsolation: true, // protect against prototype pollution
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	})

	if (process.platform === 'darwin') {
		// A menu of some kind is required on MacOS
		const menu = Menu.buildFromTemplate(mainWindowTemplate)
		Menu.setApplicationMenu(menu)
	} else {
		Menu.setApplicationMenu(null)
	}

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY + '#' + startPath)

	// Open the DevTools.
	window.webContents.openDevTools()

	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': ["default-src 'self' 'unsafe-eval' 'unsafe-inline';"],
			},
		})
	})

	return window
}
