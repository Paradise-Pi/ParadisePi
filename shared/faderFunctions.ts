/**
 * Convert a fader string (eg "/ch/1") to a fader number (eg 1)
 * @param faderString - string address of fader
 * @param mixerType - type of mixer (eg 'xair' or 'x32')
 * @returns an array containing the type string and the number of the fader
 */
export const faderStringToArray = (faderString: string, mixerType: string): [string, number] => {
	const stringArray = faderString.split('/').filter(part => part !== '')
	if (mixerType === 'x32') {
		if (faderString.includes('main/st')) return ['main/st', 1]
		if (faderString.includes('main/m')) return ['main/m', 1]
		else return [stringArray[0], parseInt(stringArray[1])]
	} else if (mixerType === 'xair') {
		if (faderString.includes('lr')) return ['lr', 1]
		else return [stringArray[0], parseInt(stringArray[1])]
	} else return ['', 0] // TODO: throw error? This is called from node and react so not easy to do
}
/**
 * Convert a fader array (such as the ones stored in the database) to a fader string (eg "/ch/1")
 * @param type - type of fader (eg 'main/st' or 'lr' or 'ch')
 * @param channel - the channel number
 * @param mixerType - type of mixer (eg 'xair' or 'x32')
 * @returns a fader string that can be sent via OSC (eg '/ch/1')
 */
export const faderArrayToString = (type: string, channel: number, mixerType: string): string => {
	if (mixerType === 'x32') {
		if (type === 'main/st') return 'main/st'
		if (type === 'main/m') return 'main/m'
		else return String(type) + '/' + String(channel).padStart(2, '0')
	} else if (mixerType === 'xair') {
		if (type === 'lr') return 'lr'
		else return String(type) + '/' + String(channel).padStart(2, '0') // TODO does the XAir like padding? We're not 100% sure
	} else return null // TODO: throw error? This is called from node and react so not easy to do
}
/**
 * Push the string throuhg the to array function, then back again. This can clean up something like /ch/01/mix/fader to ch/01
 * @param faderString - string address of fader
 * @param mixerType - type of mixer (eg 'xair' or 'x32')
 * @returns a fader string that can be sent via OSC (eg '/ch/1')
 */
export const faderStringBackToString = (faderString: string, mixerType: string): string => {
	const [type, channel] = faderStringToArray(faderString, mixerType)
	return faderArrayToString(type, channel, mixerType)
}
