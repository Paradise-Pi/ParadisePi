import { BrowserWindow, app, dialog } from 'electron'
import 'reflect-metadata'
import { routeRequest } from '../paradise/src/api/router'
import dataSource from '../paradise/src/database/dataSource'
import { ConfigRepository } from '../paradise/src/database/repository/config'
import createMainWindow from './electron/createMainWindow'
import { isRunningInDevelopmentMode } from './electron/developmentMode'
import logger, { winstonTransports } from '../paradise/src/logger/index'
import { createE131 } from '../paradise/src/output/e131/constructor'
import { createOSC } from '../paradise/src/output/osc/constructor'
import { timeClockTriggerRunner } from '../paradise/src/timeClockTriggerRunner'
import { WebServer } from '../paradise/src/webServer'
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit()
}

globalThis.port = false
globalThis.logger = logger
logger.profile('boot')
/**
 *  This method will be called when Electron has finished initialization and is ready to create browser windows.
 *  Some APIs can only be used after this event occurs.
 */
app.whenReady().then(() => {
	if (!app.isPackaged || isRunningInDevelopmentMode) logger.add(winstonTransports.console) // Turn on console logging if not in production
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
			globalThis.timeClockTriggerLoop = setInterval(() => timeClockTriggerRunner(), 20000) // Run every 20 seconds
			return ConfigRepository.getItem('fullscreen')
		})
		.then((fullscreen: string) => {
			globalThis.mainBrowserWindow = createMainWindow('/controlPanel/help', fullscreen === 'true')
			new WebServer()
			logger.add(winstonTransports.broadcast) // You can only add the broadcast transport once the webserver has started
			logger.profile('boot', { level: 'debug', message: 'Boot Timer' })
		})
		.catch(err => {
			// Error during Data Source initialization Error: Cannot find module 'undefinedbuild/Release/better_sqlite3.node'  =  https://github.com/electron-userland/electron-forge/issues/2412
			logger.error('Error during Data Source initialization', { err })
			dialog.showErrorBox('Error', 'Error during Data Source initialization')
			throw err
		})

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createMainWindow('/controlPanel/help')
	})
})

// Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		clearInterval(globalThis.timeClockTriggerLoop)
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