import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import 'reflect-metadata'
import createMainWindow from './electron/createMainWindow'
import dataSource from './database/dataSource'
import { WebServer } from './webServer'
import { routeRequest } from './api/router'
import { IpcRequest } from './api/ipc'
import logger, { winstonTransports } from './logger/index'
import { createE131 } from './output/e131/constructor'
import { createOSC } from './output/osc/constructor'
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
globalThis.logger = logger
logger.profile('boot')
app.whenReady().then(() => {
	if (!app.isPackaged) logger.add(winstonTransports.console) // Turn on console logging if not in production
	// Populate the about info
	const versions = JSON.stringify(process.versions)
	app.setAboutPanelOptions({
		applicationName: 'Paradise',
		applicationVersion: app.getVersion(),
		version: app.getVersion(),
		credits: versions,
		copyright: '©2021-22 James Bithell & John Cherry',
	})
	dataSource
		.initialize()
		.then(() => {
			createE131()
			createOSC()
			if (process.argv.includes('--e131sampler')) {
				// TODO remove this and do it whilst the app is running
				//setupE131Sampler();
				createMainWindow('/e131sampler')
			} else {
				globalThis.mainBrowserWindow = createMainWindow('/controlPanel/help')
				new WebServer()
				logger.add(winstonTransports.broadcast) // You can only add the broadcast transport once the webserver has started
				logger.profile('boot', { level: 'debug', message: 'Boot Timer' })
			}
		})
		.catch(err => {
			// Error during Data Source initialization Error: Cannot find module 'undefinedbuild/Release/better_sqlite3.node'  =  https://github.com/electron-userland/electron-forge/issues/2412
			// TODO handle with a popup to user
			console.error('Error during Data Source initialization', err)
		})

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createMainWindow('/controlPanel/help')
	})
})

// Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow('/controlPanel/help')
	}
})

ipcMain.handle('apiCall', async (event: IpcMainEvent, args: IpcRequest) => {
	try {
		const response = await routeRequest(args.path, args.method, args.payload)
		return { success: true, response, errorMessage: null }
	} catch (error) {
		return {
			success: false,
			response: null,
			errorMessage: error.message,
		}
	}
})
