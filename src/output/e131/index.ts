import { networkInterfaces } from 'os'
import e131Lib from '@paradise-pi/e131'
import { ConfigRepository } from '../../database/repository/config'

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

export default class E131 {
	// sACN = E131
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public e131Clients: Array<any> // Bit cheeky, but disabling the check because there are no typings for the lib
	private fades: Array<channelFade>
	private firstUniverse: number
	private universes: number
	private sourceName: string
	private priority: number
	private frequency: number

	constructor() {
		this.firstUniverse = parseInt(
			ConfigRepository.getItem('e131FirstUniverse')
		)
		this.universes = parseInt(ConfigRepository.getItem('e131Universes'))
		this.sourceName = ConfigRepository.getItem('e131SourceName')
		this.priority = parseInt(ConfigRepository.getItem('e131Priority'))
		this.frequency = parseInt(ConfigRepository.getItem('e131Frequency'))
		this.setupUniverses()
		this.initSending()
	}
	getUniqueId() {
		const interfaces = networkInterfaces()
		return Buffer.from(interfaces[Object.keys(interfaces)[0]][0].mac) // Get a unique ID to set as the CID
	}
	setupUniverses() {
		this.e131Clients = []
		this.fades = []
		for (
			let i = this.firstUniverse;
			i <= this.firstUniverse + this.universes - 1;
			i++
		) {
			this.e131Clients[i] = { client: new e131Lib.Client(i) }
			this.e131Clients[i]['packet'] =
				this.e131Clients[i]['client'].createPacket(512)
			this.e131Clients[i]['addressData'] =
				this.e131Clients[i]['packet'].getSlotsData()
			this.e131Clients[i]['packet'].setSourceName(this.sourceName)
			this.e131Clients[i]['packet'].setUniverse(i)
			this.e131Clients[i]['packet'].setPriority(this.priority)
			this.e131Clients[i]['packet'].setCID(this.getUniqueId())
		}
	}
	initSending() {
		//Start sending out data to the universes specified
		if (this.universes > 0) {
			for (
				let universe = this.firstUniverse;
				universe <= this.firstUniverse + this.universes - 1;
				universe++
			) {
				this.send(universe)
			}
		}
	}
	//Keep e131 alive by regularly transmitting state.
	send(universe: number) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this
		//every cycle, check whether anything is fading
		this.checkForFades()
		this.e131Clients[universe]['client'].send(
			this.e131Clients[universe]['packet'],
			function () {
				setTimeout(function () {
					self.send(universe)
				}, 1000 / self.frequency)
			}
		)
	}

	checkForFades() {
		const timeNow = +new Date()
		//fades is the array of current fades
		for (const channel of this.fades) {
			if (channel.fadeToTimestamp >= timeNow) {
				//how far through time period are we
				let fadePercent = 1
				if (channel.fadeFromTimestamp != channel.fadeToTimestamp) {
					fadePercent =
						(timeNow - channel.fadeFromTimestamp) /
						(channel.fadeToTimestamp - channel.fadeFromTimestamp)
				}
				//update channel to that level
				this.e131Clients[channel.universe]['addressData'][
					channel.channel - 1
				] =
					channel.fadeFrom +
					(channel.fadeTo - channel.fadeFrom) * fadePercent

				//time is finished so remove from array
			} else {
				this.fades.splice(
					this.fades.findIndex(
						item => item.channel === channel.channel
					),
					1
				)
			}
		}
	}

	/**
	 * Update a given universe's channel levels
	 * @param universe universe number between 1 and 63999
	 * @param channelData  - [channel:number, level:number]
	 * @param fadeTime (optional) Fade time in ms
	 */
	update(
		thisUniverse: number,
		channelData: Array<channelData>,
		fadeTime = 0
	) {
		const dateNow = new Date()
		for (const thisChannel of channelData) {
			const thisFade = {
				channel: thisChannel.channel,
				universe: thisUniverse,
				fadeFrom:
					// eslint-disable-next-line prettier/prettier
					this.e131Clients[thisUniverse]['addressData'][thisChannel.channel - 1],
				fadeTo: thisChannel.level,
				fadeFromTimestamp: +dateNow,
				fadeToTimestamp: +new Date(dateNow.getTime() + fadeTime) + 1, //fadetime + 1 allows final value to be set
			}

			//remove existing fade from array
			const currentIndex = this.fades.findIndex(
				item => item.channel == thisChannel.channel
			)
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
