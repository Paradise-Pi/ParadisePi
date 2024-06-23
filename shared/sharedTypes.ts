/**
 * List of commands formatted for \@mantine/form
 */
export interface OSCFormValues {
	commands: Array<OSCFormValue>
}

/**
 * A single osc command, stored as individual fields to allow editing.
 * The command is combined and formatted when sent using OSC.sendPreset()
 */
export interface OSCFormValue {
	command1: string
	value1: string
	command2: string
	value2: string
	key: string
}



export interface DatabaseFader {
	id?: number
	name: string
	enabled: boolean
	channel: number
	type: string
	sort?: number
	folderId?: string // An unfortunate feature of the mantine select is that it requires a string instead of a number :(
	data?: string | null // TODO remove this if we're not using it
}