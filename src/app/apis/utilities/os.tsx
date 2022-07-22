import React from 'react'
import { FaWindows } from '@react-icons/all-files/fa/FaWindows'
import { FaApple } from '@react-icons/all-files/fa/FaApple'
import { FaLinux } from '@react-icons/all-files/fa/FaLinux'
import { FaAndroid } from '@react-icons/all-files/fa/FaAndroid'
import { FaLaptop } from '@react-icons/all-files/fa/FaLaptop'
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
export const GetOSIcon = (props: { os: string }) => {
	if (props.os === 'MacOS' || props.os === 'iOS') {
		return <FaApple />
	} else if (props.os === 'Windows') {
		return <FaWindows />
	} else if (props.os === 'Linux') {
		return <FaLinux />
	} else if (props.os === 'Android') {
		return <FaAndroid />
	} else return <FaLaptop />
}
