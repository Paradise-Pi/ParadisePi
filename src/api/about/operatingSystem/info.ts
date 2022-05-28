/**
 * Get the name of the operating system being run on this computer.
 * @returns the name of the operating system being run
 * @remarks
 *
 * List pulled from {@link https://nodejs.org/api/process.html#process_process_platform}
 */
export const getOperatingSystemName = (): string => {
	switch (process.platform) {
		case 'aix':
			return 'IBM AIX'
		case 'darwin':
			return 'MacOS'
		case 'freebsd':
			return 'FreeBSD'
		case 'linux':
			return 'Linux'
		case 'openbsd':
			return 'OpenBSD'
		case 'sunos':
			return 'SunOS'
		case 'win32':
			return 'Windows'
		default:
			return 'Operating System'
	}
}
