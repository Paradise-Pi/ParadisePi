/* eslint-disable @typescript-eslint/no-explicit-any */
import oscHandler from 'osc'
import { broadcast } from './../../api/broadcast'
import { DatabaseFader, FaderRepository } from '../../database/repository/fader'
import { OSCFormValue } from '../../app/Components/Admin/Controls/Presets/EditModal/OSC'
import { iLevels, meter1PacketParser } from './meterFunctions'
import { clearInterval } from 'timers'

export interface OSCDatastore {
	status: boolean
	mixerName: string | false
	metering: iLevels | false
	[key: string]: any
}

/**
 * OSC Controller class
 * Cannot be called directly - create a child class for each device type (see devices subdirectory)
 */
export default abstract class OSC {
	private udpPort: any
	private lastOSCMessage: number
	private consoleAddress: string
	private oscPort: number //osc port of device
	private deviceType: string
	private statusCheckerTimer: NodeJS.Timer
	private datastore: OSCDatastore

	/**
	 * Create a new osc object, and setup connection
	 * @param address - ip address of console
	 * @param port - osc port of console
	 * @param master - string address of master fader of the console (eg "/lr" for xair)
	 */
	constructor(address: string, port: number, deviceType: string) {
		this.consoleAddress = address
		this.oscPort = port
		this.deviceType = deviceType
		this.lastOSCMessage = 0
		this.datastore = {
			status: false,
			mixerName: false,
			metering: false,
		}
		this.setupOSC()
	}

	/**
	 * Send required addresses to get basic info about the device
	 */
	private subscribeOSC() {
		if (this.deviceType === 'xair' || this.deviceType === 'x32') {
			this.udpPort.send({ address: '/xremote' })
			this.udpPort.send({ address: '/meters', args: [{ type: 's', value: '/meters/1' }] })
		}
	}

	/**
	 * Check we're actually connected, and try to reconnect if not
	 */
	private checkStatusOSC(): void {
		const currentMillis = +new Date()
		if (currentMillis - this.lastOSCMessage > 3000) {
			// Now disconnected from the Device - been more than 3 seconds since we've received a message
			this.setUDPStatus(false)
			this.udpPort.send({ address: '/status', args: [] }) // Keep trying anyway, no harm
		} else if (currentMillis - this.lastOSCMessage > 500 && this.datastore.status) {
			// Send a status request to hope you get something back - before you decide you're offline
			this.udpPort.send({ address: '/status', args: [] })
		} else if (currentMillis - this.lastOSCMessage < 500 && !this.datastore.status) {
			// Reconnected
			this.udpPort.send({ address: '/info', args: [] })
			this.setUDPStatus(true)
			this.subscribeOSC()
			// When a connection is first opened, want to get the statuses of stuff we're interested in
			FaderRepository.getAll().then((faders: DatabaseFader[]) => {
				// Iterate through all faders to send subscriptions for them (so we get updates if their fader level changes)
				faders.forEach(entry => {
					// Note that the stereo output faders don't have a number, so don't send a channel number
					const thisAddress = `/${String(entry.type)}${
						!['main/st', 'main/m', 'lr'].includes(String(entry.type))
							? '/' + String(entry.channel).padStart(2, '0')
							: ''
					}`
					// Fader
					this.udpPort.send({
						address: thisAddress + '/mix/fader',
						args: [],
					})
					// Mute status
					// this.udpPort.send({
					// 	address: thisAddress + '/mix/on',
					// 	args: [],
					// })
				})
			})
		} else if (!this.datastore.status) {
			this.setUDPStatus(true)
		}
	}

	/**
	 * Set the status of the connection to the device
	 * @param status - true if connected, false if not
	 */
	private setUDPStatus(status: boolean) {
		this.datastore.status = status
		this.databaseUpdated()
	}

	/**
	 * Send the frontend a new database of stuff from OSC, such as faders + metering + status
	 * @param data - data to send to frontend
	 */
	private databaseUpdated() {
		const database = this.datastore
		broadcast('oscDatastoreUpdate', database)
	}

	/**
	 * Get a copy of the database of stuff from OSC
	 * @returns database
	 */
	public getDatastore() {
		return this.datastore
	}

	/**
	 * Setup actual osc handling
	 */
	private setupOSC() {
		// TODO debug as fails if more than one paradise open
		this.udpPort = new oscHandler.UDPPort({
			localAddress: '0.0.0.0',
			localPort: 57121,
			remotePort: this.oscPort,
			remoteAddress: this.consoleAddress,
		})

		this.udpPort.on('ready', () => {
			logger.log('info', '[OSC] UDP Socket open and listening')
			this.statusCheckerTimer = setInterval(() => {
				this.checkStatusOSC()
			}, 1000)
		})

		this.udpPort.on('message', (oscMessage: { address: string; parsed: any; args: any[] }) => {
			this.lastOSCMessage = +new Date()
			if (oscMessage.address === '/meters/1') {
				this.datastore.metering = meter1PacketParser(oscMessage.args[0])
			} else if (oscMessage.address === '/status' && oscMessage.args.length === 3) {
				this.datastore.mixerName = oscMessage.args[2]
			} else {
				logger.verbose('[OSC] Received unrecognized message', { oscMessage })
			}
			this.databaseUpdated()
		})
		this.udpPort.on('error', (err: any) => {
			logger.log('error', err)
		})

		//actually open the content
		this.udpPort.open()
	}

	/**
	 * Close the connection and the port
	 */
	public terminate() {
		this.udpPort.close()
		this.lastOSCMessage = 0
		this.datastore.status = false
		clearInterval(this.statusCheckerTimer)
		logger.info('Terminating UPD Port for OSC')
	}

	/**
	 * Main sending handler
	 * @param presetData - data to send to the device from a Preset
	 */
	public send(presetData: any) {
		const data: OSCFormValue = presetData[1] //Something is incorrectly wrapping the data in an array so we need to get rid of it
		const address = data.command1 + String(data.value1).padStart(2, '0') + data.command2
		let args = {}
		if (Number.isInteger(Number(data.value2))) {
			//assuming we have an integer so need an integer type
			args = { type: 'i', value: data.value2 }
		} else {
			//we have a decimal number so need a floating point type
			args = { type: 'f', value: data.value2 }
		}

		//Actual sending
		logger.verbose('Sending OSC Packet to address ' + address, { args })
		this.udpPort.send({ address: address, args: args })
	}
}
