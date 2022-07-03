/* eslint-disable @typescript-eslint/no-explicit-any */
import oscHandler from 'osc'
import { broadcast } from './../../api/broadcast'
import { DatabaseFader, FaderRepository } from '../../database/repository/fader'
import { OSCFormValue } from '../../app/Components/Admin/Controls/Presets/EditModal/OSC'
import { MeterLevels, meter1PacketParser } from './meterFunctions'
import { clearInterval } from 'timers'
import { faderArrayToString, faderStringToArray } from './faderFunctions'

export interface OSCDatastore {
	status: boolean
	mixerName: string | false
	metering: MeterLevels | false
	faderValues: {
		[key: string]: number
	}
	faderMutes: {
		[key: string]: boolean
	}
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
			faderValues: {},
			faderMutes: {},
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
			FaderRepository.getAll().then((faders: DatabaseFader[]) => {
				// Iterate through all faders to send subscriptions for them (so we get updates if their fader level changes)
				faders.forEach(entry => {
					// Fader
					this.udpPort.send({
						address: '/' + faderArrayToString(entry.type, entry.channel, this.deviceType) + '/mix/fader',
						args: [],
					})
					// Mute status
					this.udpPort.send({
						address: '/' + faderArrayToString(entry.type, entry.channel, this.deviceType) + '/mix/on',
						args: [],
					})
				})
			})
		}
	}

	/**
	 * Check we're actually connected, and try to reconnect if not
	 */
	private checkStatusOSC(): void {
		const currentMillis = +new Date()
		if (
			currentMillis - this.lastOSCMessage > 500 &&
			currentMillis - this.lastOSCMessage < 3000 &&
			this.datastore.status
		) {
			// Not heard for over 500ms, so assume we might have lost connection and try and get something back
			this.udpPort.send({ address: '/status', args: [] })
		} else if (currentMillis - this.lastOSCMessage >= 3000) {
			// Been over 3 seconds since last message, so assume we're not connected and try to reconnect once more
			this.udpPort.send({ address: '/status', args: [] }) // Keep trying to connect - in case it comes back
			if (this.datastore.status) {
				this.datastore.status = false
				this.databaseUpdated()
				this.setCheckStatusCycle(5000) // Turn the frequency right down, we don't need to spam it constantly
			}
		} else if (currentMillis - this.lastOSCMessage < 500 && !this.datastore.status) {
			// We're not connected but we have heard recently, so we need to setup the connection again
			this.udpPort.send({ address: '/info', args: [] })
			this.datastore.status = true
			this.setCheckStatusCycle(250) // Turn the frequency back up to maintain a connection
			this.subscribeOSC()
			this.databaseUpdated()
		}
	}
	/**
	 * Set the check status cycle timings to a new value
	 * @param interval - time in ms to wait before checking status
	 */
	private setCheckStatusCycle(interval: number) {
		if (typeof this.statusCheckerTimer === 'object') {
			clearInterval(this.statusCheckerTimer)
		}
		this.statusCheckerTimer = setInterval(() => {
			this.checkStatusOSC()
		}, interval)
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
			this.setCheckStatusCycle(250)
			this.subscribeOSC()
		})

		this.udpPort.on('message', (oscMessage: { address: string; parsed: any; args: any[] }) => {
			this.lastOSCMessage = +new Date()
			if (oscMessage.address === '/meters/1') {
				this.datastore.metering = meter1PacketParser(oscMessage.args[0], this.deviceType)
			} else if (oscMessage.address === '/status' && oscMessage.args.length === 3) {
				this.datastore.mixerName = oscMessage.args[2]
			} else if (oscMessage.address === '/info' && oscMessage.args.length === 4) {
				// Example ["V2.07","X32 Emulator","X32","4.06"]
				this.datastore.mixerName = oscMessage.args[1]
			} else if (oscMessage.address.endsWith('/mix/fader') && oscMessage.args.length === 1) {
				const faderArray = faderStringToArray(oscMessage.address, this.deviceType)
				this.datastore.faderValues[faderArrayToString(faderArray[0], faderArray[1], this.deviceType)] =
					oscMessage.args[0]
			} else if (oscMessage.address.endsWith('/mix/on') && oscMessage.args.length === 1) {
				const faderArray = faderStringToArray(oscMessage.address, this.deviceType)
				this.datastore.faderMutes[faderArrayToString(faderArray[0], faderArray[1], this.deviceType)] =
					oscMessage.args[0] === 1
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
