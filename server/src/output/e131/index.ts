/* eslint-disable @typescript-eslint/no-this-alias */
import { Client, Server } from '@paradise-pi/e131'
import ip from 'ip'
import { networkInterfaces } from 'os'
import { broadcast } from '../../api/broadcast'
import { Database, createDatabaseObject, sendDatabaseObject } from '../../api/database'
import { PresetRepository } from '../../database/repository/preset'
import logger from '../../logger'
export interface channelData {
	channel: number
	level: number
}

interface channelFade {
	channel: number
	universe: number
	fadeFrom: number
	fadeTo: number
	fadeFromTimestamp: number
	fadeToTimestamp: number
}

interface WorkingUniverseData {
	// Whilst the universe is being sampled then arrays are captured, they are then converted to final values
	[sourceName: string]: {
		[universe: number]: {
			[channel: number]: Array<number>
		}
	}
}

/**
 * sACN = E1.31
 */
export class E131 {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private e131Clients: Array<any>
	private fades: Array<channelFade>
	private firstUniverse: number
	private universes: number
	private sourceName: string
	private priority: number
	private frequency: number
	private running: boolean
	private sampleTime: number

	constructor(
		firstUniverse: number,
		universes: number,
		sourceName: string,
		priority: number,
		frequency: number,
		sampleTime: number
	) {
		this.firstUniverse = firstUniverse
		this.universes = universes
		this.sourceName = sourceName
		this.priority = priority
		this.frequency = frequency
		this.sampleTime = sampleTime
		logger.verbose('Opening E1.31 Connection')
		this.init()
	}

	private init() {
		this.running = true
		this.setupUniverses()
		this.initSending()
	}

	/**
	 * Setup instances of the E1.31 class for each universe needed
	 */
	private setupUniverses() {
		this.e131Clients = []
		this.fades = []
		for (let i = this.firstUniverse; i <= this.firstUniverse + this.universes - 1; i++) {
			this.e131Clients[i] = { client: new Client(i) }
			this.e131Clients[i]['packet'] = this.e131Clients[i]['client'].createPacket(512)
			this.e131Clients[i]['addressData'] = this.e131Clients[i]['packet'].getSlotsData()
			this.e131Clients[i]['packet'].setSourceName(this.sourceName)
			this.e131Clients[i]['packet'].setUniverse(i)
			this.e131Clients[i]['packet'].setPriority(this.priority)
			this.e131Clients[i]['packet'].setCID(this.getUniqueId())
			this.e131Clients[i]['packet'].setOption(this.e131Clients[i]['packet'].Options.TERMINATED, false)
		}
	}
	/**
	 * Start sending E1.31 packets
	 */
	private initSending() {
		//Start sending out data to the universes specified
		if (this.universes > 0) {
			for (let universe = this.firstUniverse; universe <= this.firstUniverse + this.universes - 1; universe++) {
				this.send(universe)
			}
		}
	}
	/**
	 * Send a universe of data, and set it up to send it again soon
	 * @param universe - number of the universe to send
	 */
	private send(universe: number) {
		if (this.running) {
			const self = this
			this.checkForFades() //every cycle, check whether anything is fading
			this.e131Clients[universe]['client'].send(this.e131Clients[universe]['packet'], () => {
				setTimeout(() => {
					self.send(universe)
				}, 1000 / self.frequency)
			})
		}
	}
	/**
	 * Stop sending and close all connections
	 * @returns promise that resolves when the termination is done
	 */
	public terminate(): Promise<void> {
		logger.verbose('Terminating E1.31 Client')
		this.running = false // Stop the normal loop to avoid client confusion
		return [...Array(this.firstUniverse + this.universes - 1)].reduce((previous, _current, i) => {
			return previous.then(() => {
				// Set the packet to be a terminator packet (warns the clients that this is the last time they'll hear from it)
				if (
					this.e131Clients &&
					this.e131Clients[i + this.firstUniverse] &&
					this.e131Clients[i + this.firstUniverse]['packet']
				) {
					this.e131Clients[i + this.firstUniverse]['packet'].setOption(
						this.e131Clients[i + this.firstUniverse]['packet'].Options.TERMINATED,
						true
					)
					return new Promise<void>(resolve => {
						// Send out the final packet
						this.e131Clients[i + this.firstUniverse]['client'].send(
							this.e131Clients[i + this.firstUniverse]['packet'],
							() => {
								// Close the connection
								this.e131Clients[i + this.firstUniverse] = undefined
								resolve()
							}
						)
					})
				} else {
					return Promise.resolve()
				}
			})
		}, Promise.resolve())
	}
	/**
	 * Check if any fades are in progress, and if they are update the progress through the array appropriately
	 */
	private checkForFades() {
		const timeNow = new Date().getTime()
		let i = this.fades.length
		while (i--) {
			if (
				this.e131Clients[this.fades[i].universe]['addressData'][this.fades[i].channel - 1] ===
				this.fades[i].fadeTo
			) {
				// If it's already at the value, don't bother with further logic and setting it again
				this.fades.splice(i, 1)
			} else if (
				this.fades[i].fadeFromTimestamp !== this.fades[i].fadeToTimestamp &&
				this.fades[i].fadeToTimestamp > timeNow
			) {
				//how far through time period are we
				const fadePercent =
					(timeNow - this.fades[i].fadeFromTimestamp) /
					(this.fades[i].fadeToTimestamp - this.fades[i].fadeFromTimestamp)
				//update channel to that level
				this.e131Clients[this.fades[i].universe]['addressData'][this.fades[i].channel - 1] = Math.round(
					this.fades[i].fadeFrom + (this.fades[i].fadeTo - this.fades[i].fadeFrom) * fadePercent
				)
			} else {
				// Time is up, so set to final value and remove from array
				this.e131Clients[this.fades[i].universe]['addressData'][this.fades[i].channel - 1] =
					this.fades[i].fadeTo
				this.fades.splice(i, 1)
			}
		}
	}
	/**
	 * Update a given universe's channel levels - this is the function called right across the project to update values
	 *
	 * @param thisUniverse - the universe number to update
	 * @param channelData  - [channel:number, level:number]
	 * @param fadeTime - (optional) Fade time in ms
	 */
	public update(thisUniverse: number, channelData: Array<channelData>, fadeTime = 0) {
		//Check universe is valid
		if (this.universes + this.firstUniverse - 1 >= thisUniverse && this.firstUniverse <= thisUniverse) {
			const dateNow = new Date().getTime()
			for (const thisChannel of channelData) {
				const thisFade = {
					channel: thisChannel.channel,
					universe: thisUniverse,
					fadeFrom: this.e131Clients[thisUniverse]['addressData'][thisChannel.channel - 1],
					fadeTo: thisChannel.level,
					fadeFromTimestamp: dateNow,
					fadeToTimestamp: dateNow + fadeTime,
				}
				//remove existing fade from array
				const currentIndex = this.fades.findIndex(item => item.channel == thisChannel.channel)
				//if >-1, channel already exists in array
				if (currentIndex > -1) {
					//remove the old fade
					this.fades.splice(currentIndex, 1)
				}
				//always add new fade
				this.fades.push(thisFade)
			}
		}
	}
	/**
	 * Convert from the object format used in the database to the array format used by the E131 class
	 * @param object - object to be converted to an array
	 * @returns array in the correct format
	 */
	public convertObjectToChannelData(object: { [key: string]: string }): Array<channelData> {
		const returnArray: Array<channelData> = []
		Object.entries(object).forEach(([key, value]) => {
			returnArray.push({ channel: parseInt(key), level: parseInt(value) })
		})
		return returnArray
	}
	/**
	 * Get a unique ID for this device from the MAC address of the first network interface
	 * @returns Unique ID for this device
	 */
	private getUniqueId() {
		const interfaces = networkInterfaces()
		return Buffer.from(interfaces[Object.keys(interfaces)[0]][0].mac) // Get a unique ID to set as the CID
	}

	/**
	 * Returns the most common value from an array
	 * @param arr - array
	 * @returns the most common item in the array
	 */
	private arrayMode(arr: Array<number>): number {
		if (arr.length === 0) return null
		else if (arr.length === 1) return arr[0]
		else return arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop()
	}

	public async sampleE131() {
		logger.verbose('Starting Sampling Mode - storing most common value for each parameter where effects are in use')

		const numUniverses = this.universes > 20 ? 20 : this.universes // 20 universe limit is enforced due to memory limitations
		const universes = Array.from({ length: numUniverses }, (_, i) => i + this.firstUniverse) // Generates an array like [1,2,3,4,5] because that's what the lib likes
		const sampleModeDuration =
			this.sampleTime === undefined || this.sampleTime > 300 || this.sampleTime < 5
				? 15000
				: this.sampleTime * 1000

		broadcast('e131SamplingMode', {
			messageType: 'START',
			status: true,
			duration: sampleModeDuration + 3000,
			message: `Launching sampling mode`,
		})
		//get our current ip so we know which network interface is usable
		const ipAddress = ip.address()
		await this.terminate() // Stop light output entirely and clear all universes
		await new Promise(resolve => setTimeout(resolve, 2000)) // Wait for other sACN clients to detect that we've stopped sending
		//Create our actual server object now port is free as we need to wait for the E131 lib to terminate
		const server = new Server(universes, 5568, ipAddress)
		logger.debug('E1.31 Server (receiver) started')
		broadcast('e131SamplingMode', {
			messageType: 'LOGLINE',
			message: `Started sampling mode for ${sampleModeDuration / 1000} seconds`,
		})

		server.on('listening', () => {
			broadcast('e131SamplingMode', {
				messageType: 'LOGLINE',
				message: 'Listening on port ' + server.getPort() + ' - ' + server.getUniverses() + ' universes',
			})
			logger.verbose('Listening on port ' + server.getPort() + ' - ' + server.getUniverses() + ' universes')
		})

		server.on('error', (error: unknown) => {
			broadcast('e131SamplingMode', {
				messageType: 'LOGLINE',
				message: 'Encountered error trying to sample data: ' + error,
			})
			logger.verbose('Encountered error', error)
		})

		const universeData: WorkingUniverseData = {}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		server.on('packet', (packet: any) => {
			const sourceName: string = packet.getSourceName().replace(/\0/g, '')
			const universe: number = packet.getUniverse()
			const slotsData = packet.getSlotsData()
			const priority: number = packet.getPriority()

			if (priority != 0) {
				// For some reason, known only to the developers of this library/sACN (I'm not even sure)........you get some bizarre packets that are just priorities and nothing else from time to time. The only feature of these I can find is that they have no priority, so if you find one without priority just ignore it and hope for the best.
				if (universeData[sourceName] === undefined) {
					universeData[sourceName] = {}
					broadcast('e131SamplingMode', {
						messageType: 'LOGLINE',
						message: 'Found new device ' + sourceName,
					})
					logger.verbose('Found new device ' + sourceName)
				}
				if (universeData[sourceName][universe] === undefined) {
					universeData[sourceName][universe] = {}
					broadcast('e131SamplingMode', {
						messageType: 'LOGLINE',
						message: 'Found universe ' + universe + ' for device ' + sourceName,
					})
					logger.verbose('Found universe ' + universe + ' for device ' + sourceName)
				}
				for (let i = 0; i < slotsData.length; i++) {
					if (universeData[sourceName][universe][i + 1] === undefined) {
						universeData[sourceName][universe][i + 1] = []
					}
					universeData[sourceName][universe][i + 1].push(slotsData[i])
				}
			}
		})

		await new Promise(resolve => setTimeout(resolve, sampleModeDuration)) // Wait the specified amount of time before stopping the server
		broadcast('e131SamplingMode', {
			messageType: 'LOGLINE',
			message: 'Sampling complete, collating data',
		})
		for (const [deviceName, device] of Object.entries(universeData)) {
			for (const [universeID, universeData] of Object.entries(device)) {
				const finishedUniverseData: {
					[channel: number]: number
				} = {}
				for (const key in universeData) {
					const mode = this.arrayMode(universeData[key])
					if (mode !== null && mode !== undefined) {
						finishedUniverseData[key] = mode
					}
				}
				PresetRepository.insert({
					name: 'Universe ' + universeID + ' sampled from ' + deviceName,
					enabled: false,
					universe: universeID,
					type: 'e131',
					data: JSON.parse(JSON.stringify(finishedUniverseData)),
				})
					.then(() => logger.verbose('Added Preset'))
					.catch(err => logger.error(err))
			}
		}

		logger.verbose('Finished sampling - Resuming E1.31 Connection & Uploading Presets')

		server.close()
		this.init()

		broadcast('e131SamplingMode', {
			status: false,
			messageType: 'STOP',
			message: 'Sampling completed',
		})
		createDatabaseObject('Added sampled universes').then((response: Database) => {
			sendDatabaseObject(response)
		})
	}
}
