/* eslint-disable @typescript-eslint/no-this-alias */
import { networkInterfaces } from 'os'
import e131Lib from '@paradise-pi/e131'

interface channelData {
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
/**
 * sACN = E1.31
 */
export class E131 {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected e131Clients: Array<any>
	protected fades: Array<channelFade>
	protected firstUniverse: number
	protected universes: number
	protected sourceName: string
	protected priority: number
	protected frequency: number
	protected running: boolean

	constructor(firstUniverse: number, universes: number, sourceName: string, priority: number, frequency: number) {
		this.firstUniverse = firstUniverse
		this.universes = universes
		this.sourceName = sourceName
		this.priority = priority
		this.frequency = frequency
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
			this.e131Clients[i] = { client: new e131Lib.Client(i) }
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
		logger.info('Terminating E1.31 Connection')
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
}
