
export interface DatabaseTimeClockTrigger {
	id: number
	presetId: string // An unfortunate feature of the mantine select is that it requires a string instead of a number :(
	time: string
	notes: string
	enabled: boolean
	enabledWhenLocked: boolean
	timeout: number
	countdownWarning: number // TODO implement
	countdownWarningText: string // TODO implement

	lastTriggeredString: string

	mon: boolean
	tues: boolean
	weds: boolean
	thurs: boolean
	fri: boolean
	sat: boolean
	sun: boolean
}

export type PresetTypes = 'e131' | 'osc' | 'http' | 'macro'
export interface DatabasePreset {
	id: number
	name: string
	enabled: boolean
	icon?: string | null
	type?: PresetTypes
	universe?: string | null
	fadeTime?: number
	data?: string | null
	httpTriggerEnabled: boolean
	folderId?: string // An unfortunate feature of the mantine select is that it requires a string instead of a number :(
	color?: string
}

export interface DatabaseFolder {
	name: string
	id: number
	sort?: number
	icon?: string
	infoText?: string
	children?: Array<DatabaseFolder>
	parent?: DatabaseFolder
	parentFolderId?: string
	presets?: Array<DatabasePreset>
	faders?: Array<DatabaseFader>
}

export interface Database {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
	about: {
		operatingSystem: {
			name: string
		}
		version: string
		ipAddress: string
		port: number | false
	}
	config: {
		general: {
			deviceLock: boolean
			timeoutTime: number
			helpText: string
			adminLinkFromControlPanel: boolean
			adminPin: string
			remotePassword: string
			fullscreen: boolean
		}
		osc: {
			OSCTargetIP: string
			OSCMixerType: string
			OSCEnabled: boolean
		}
		e131: {
			e131Enabled: boolean
			e131FirstUniverse: number
			e131Universes: number
			e131SourceName: string
			e131Priority: number
			e131Frequency: number
			e131FadeTime: number
			e131Sampler_time: number
		}
	}
	presets: Array<DatabasePreset>
	timeClockTriggers: Array<DatabaseTimeClockTrigger>
	folders: {
		[key: number]: DatabaseFolder
	}
	faders: Array<DatabaseFader>
}
