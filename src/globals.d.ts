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
import { OSC } from './output/osc'

declare global {
	var mainBrowserWindow: BrowserWindow
	var app: App
	var logger: Logger
	var e131: E131
	var osc: OSC
	var port: number | false
	interface apiObject {
		[key: string]: any
	}
}

declare module '*.svg' {
	const content: any
	export default content
}

/**
 * Mantine V5 removes this typing and returns an Any, so we need to override
 * that with what we actually recieve from the getInputProps function.
 */
interface InputProps {
	value: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange: (event: any) => void
	error: string
}
