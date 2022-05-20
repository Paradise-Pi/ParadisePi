import { networkInterfaces } from 'os'
import e131Lib from 'e131'
import { ConfigRepository } from '../../database/repository/config'

export default class E131 {
	// sACN = E131
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public e131Clients: Array<any> // Bit cheeky, but disabling the check because there are no typings for the lib
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
		this.e131Clients[universe]['client'].send(
			this.e131Clients[universe]['packet'],
			function () {
				setTimeout(function () {
					this.send(universe)
				}, 1000 / this.frequency)
			}
		)
	}
	/**
	 * Update a given universe's channel levels
	 * @param universe [Integer] universe number between 1 and 63999
	 * @param channelData [Array<number>] - ["channel Number" => new level]
	 * @param fadeTime Fade time in ms
	 */
	update(universe: number, channelData: Array<number>, fadeTime: number) {
		if (fadeTime) {
			const startLevel = this.e131Clients[universe]['addressData']
			this.fade(universe, startLevel, channelData, fadeTime, 0)
		} else {
			this.snap(universe, channelData)
		}
	}

	//update channels instantly
	private snap(universe: number, channelData: Array<number>) {
		for (const [channel, value] of Object.entries(channelData)) {
			//                            channels are 1 indexed, array is 0 indexed :(
			this.e131Clients[universe]['addressData'][+channel - 1] = value
		}
	}

	//update channel level over given fadeTime
	private fade(
		universe: number,
		startLevel: Buffer, //full buffer of initial levels
		targetLevel: Array<number>, //array of target channel levels
		fadeTime: number, //time in ms
		currentTime: number //current time in ms
	) {
		const fadePercent = currentTime / fadeTime

		for (const [channel, value] of Object.entries(targetLevel)) {
			const levelDifference = value - startLevel[+channel - 1]
			const levelStep = levelDifference * fadePercent
			this.e131Clients[universe]['addressData'][+channel - 1] =
				startLevel[+channel - 1] + levelStep
		}

		if (fadePercent < 1) {
			setTimeout(function () {
				this.fade(startLevel, targetLevel, fadeTime, currentTime + 500)
			}, 500)
		}
	}
}
