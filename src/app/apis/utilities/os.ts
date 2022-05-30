import React from 'react'
export const getOS = () => {
	const { userAgent } = window.navigator
	const macosPlatforms = /(Macintosh)|(MacIntel)|(MacPPC)|(Mac68K)/i
	const windowsPlatforms = /(Win32)|(Win64)|(Windows)|(WinCE)/i
	const iosPlatforms = /(iPhone)|(iPad)|(iPod)/i

	if (macosPlatforms.test(userAgent)) {
		return 'MacOS'
	}
	if (iosPlatforms.test(userAgent)) {
		return 'iOS'
	}
	if (windowsPlatforms.test(userAgent)) {
		return 'Windows'
	}
	if (/Android/i.test(userAgent)) {
		return 'Android'
	}
	if (/Linux/i.test(userAgent)) {
		return 'Linux'
	}

	return 'Undetermined'
}
export const getOSIcon = (os: string) => {
	
}
