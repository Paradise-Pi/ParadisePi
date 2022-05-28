/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/**
 * Setup the global scope variables
 *
 * https://github.com/Microsoft/TypeScript/pull/29332
 */

import { App, BrowserWindow } from 'electron'
import { Logger } from 'winston'

declare global {
	var mainBrowserWindow: BrowserWindow
	var app: App
	var logger: Logger
	interface apiObject {
		[key: string]: any
	}
}
