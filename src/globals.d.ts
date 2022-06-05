/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/**
 * Setup the global scope variables
 *
 * https://github.com/Microsoft/TypeScript/pull/29332
 */

import { App, BrowserWindow } from 'electron'
import { Logger } from 'winston'
import { E131 } from './output/e131'
import osc from './output/osc'

declare global {
	var mainBrowserWindow: BrowserWindow
	var app: App
	var logger: Logger
	var e131: E131
	var osc: osc

	interface apiObject {
		[key: string]: any
	}
}
