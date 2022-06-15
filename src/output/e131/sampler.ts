import { E131 } from '.'
import e131Lib from '@paradise-pi/e131'
import { broadcast } from '../../api/broadcast'
import { ApiCall } from '../../app/apis/wrapper'

interface UniverseData {
	[sourceName: string]: {
		[universe: number]: {
			[channel: number]: number
		}
	}
}

export class E131Sampler extends E131 {
	private effectMode: boolean
	private sampleTime: number

	constructor(
		firstUniverse: number,
		universes: number,
		sourceName: string,
		priority: number,
		frequency: number,
		effectMode: boolean,
		sampleTime: number
	) {
		super(firstUniverse, universes, sourceName, priority, frequency)
		this.effectMode = effectMode
		this.sampleTime = sampleTime
	}

	public sampleUniverse() {
		//log effect mode
		logger.info(
			this.effectMode
				? 'Storing first value of a varying value (EFFECT MODE ON)'
				: 'Ignoring varying values (EFFECT MODE OFF)'
		)

		//how many universes are we sampling?
		//20 universe limit is enforced due to memory limitations
		const numUniverses = this.universes > 20 ? 20 : this.universes

		const universes = []
		for (let i = 1; i <= numUniverses; i++) {
			universes.push(i)
		}
		const universeData: UniverseData = {}
		const server = new e131Lib.Server(universes)

		server.on('listening', function () {
			logger.info('Listening on port ' + this.port + '- universes ' + this.universes)
		})

		server.on(
			'packet',
			function (packet: {
				getSourceName: () => string
				getUniverse: () => number
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				getSlotsData: () => any
				getPriority: () => number
			}) {
				const sourceName: string = packet.getSourceName().replace(/\0/g, '')
				const universe: number = packet.getUniverse()
				const slotsData = packet.getSlotsData()
				const priority: number = packet.getPriority()

				if (priority != 0) {
					// For some reason, known only to the developers of this library/sACN (I'm not even sure)........you get some bizarre packets that are just priorities and nothing else from time to time. The only feature of these I can find is that they have no priority, so if you find one without priority just ignore it and hope for the best.
					if (universeData[sourceName] === undefined) {
						universeData[sourceName] = {}
						logger.info('Found new device ' + sourceName)
					}
					if (universeData[sourceName][universe] === undefined) {
						universeData[sourceName][universe] = {}
						logger.info('Found universe ' + universe + ' for device ' + sourceName)
					}
					for (let i = 0; i < slotsData.length; i++) {
						if (universeData[sourceName][universe][i + 1] === undefined) {
							universeData[sourceName][universe][i + 1] = slotsData[i]
						} else if (!this.effectMode && universeData[sourceName][universe][i + 1] === -1) {
							// This has already been marked as jittery - so ignore it
						} else if (!this.effectMode && universeData[sourceName][universe][i + 1] !== slotsData[i]) {
							// So we've found data that doesn't match what we had down for it before, so it might be that an effect is running. The best way to deal with this is to mark it as false, which means it won't be saved (on purpose)
							universeData[sourceName][universe][i + 1] = -1
							logger.warn(
								'Discarding data for channel ' +
									i +
									' due to value change (universe ' +
									universe +
									' from device ' +
									sourceName +
									') - is an effect running?'
							)
						}
					}
				}
			}
		)

		//Timeout timer
		let timeoutTimerDuration = 15000 // 15 seconds is the default
		if (!(this.sampleTime === undefined || this.sampleTime > 300 || this.sampleTime < 5)) {
			timeoutTimerDuration = this.sampleTime * 1000
		}

		setTimeout(async () => {
			server.close()
			for (const [deviceName, device] of Object.entries(universeData)) {
				for (const [universeID, universeData] of Object.entries(device)) {
					for (const key in universeData) {
						// eslint-disable-next-line no-prototype-builtins
						if (universeData.hasOwnProperty(key) && universeData[key] === false) {
							delete universeData[key] // Remove false values
						}
					}
					ApiCall.put('/presets', {
						name: 'Universe ' + universeID + ' sampled from ' + deviceName,
						enabled: true,
						universe: universeID,
						setArguments: JSON.stringify(universeData),
					})
				}
			}
		}, timeoutTimerDuration)

		const timeoutStarted = +new Date()
		setInterval(function () {
			const currentTime = +new Date()
			broadcast('progress', { progress: currentTime - timeoutStarted, total: timeoutTimerDuration })
		}, 500)
	}
}
