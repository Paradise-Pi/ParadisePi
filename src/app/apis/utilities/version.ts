export const runningInElectron = (): boolean => {
	const userAgent = navigator.userAgent.toLowerCase()
	return userAgent.indexOf(' electron/') > -1
}
