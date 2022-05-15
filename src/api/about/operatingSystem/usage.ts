import osu from 'node-os-utils'
interface OperatingSystemUsage {
	cpuPercent: number
	cpuCount: number
	os: string
	uptime: number
	hostname: string
	type: string
	arch: string
	network: {
		[key: string]: { inputMb: number; outputMb: number }
	}
	memory: {
		totalMemMb: number
		freeMemMb: number
		freeMemPercentage: number
	}
}
const operatingSystemUsageFactory = (): OperatingSystemUsage => {
	return {
		cpuPercent: 0,
		cpuCount: 0,
		os: '',
		uptime: 0,
		hostname: '',
		type: '',
		arch: '',
		network: {},
		memory: {
			totalMemMb: 0,
			freeMemMb: 0,
			freeMemPercentage: 0,
		},
	}
}
export const getOperatingSystemUsage = (): Promise<OperatingSystemUsage> => {
	return new Promise(resolve => {
		const usage = operatingSystemUsageFactory()
		return osu.cpu
			.usage()
			.then(info => {
				usage.cpuPercent = info
				return osu.cpu.count()
			})
			.then(count => {
				usage.cpuCount = count
				return osu.os.platform()
			})
			.then(info => {
				usage.os = info
				return osu.os.uptime()
			})
			.then(info => {
				usage.uptime = info
				return osu.os.hostname()
			})
			.then(info => {
				usage.hostname = info
				return osu.os.type()
			})
			.then(info => {
				usage.type = info
				return osu.os.arch()
			})
			.then(info => {
				usage.arch = info
				return osu.netstat.inOut()
			})
			.then(info => {
				usage.network = info as {
					[key: string]: { inputMb: number; outputMb: number }
				}
				return osu.mem.info()
			})
			.then(info => {
				usage.memory = info
				resolve(usage)
			})
	})
}
