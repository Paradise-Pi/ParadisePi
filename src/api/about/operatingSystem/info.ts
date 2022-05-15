export const getOperatingSystemName = (): string => {
	switch (process.platform) {
		// List pulled from https://nodejs.org/api/process.html#process_process_platform
		case 'aix':
			return 'IBM AIX'
			break
		case 'darwin':
			return 'MacOS'
			break
		case 'freebsd':
			return 'FreeBSD'
			break
		case 'linux':
			return 'Linux'
			break
		case 'openbsd':
			return 'OpenBSD'
			break
		case 'sunos':
			return 'SunOS'
			break
		case 'win32':
			return 'Windows'
			break
		default:
			return 'Operating System'
	}
}
