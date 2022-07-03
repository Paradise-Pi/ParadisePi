/* eslint-disable @typescript-eslint/no-explicit-any */
import oscHandler from 'osc'
import { broadcast } from './../../api/broadcast'
import { DatabaseFader, FaderRepository } from '../../database/repository/fader'
import { OSCFormValue } from '../../app/Components/Admin/Controls/Presets/EditModal/OSC'
import { MeterLevels, meter1PacketParser } from './meterFunctions'
import { clearInterval } from 'timers'
import { faderArrayToString, faderStringBackToString } from './faderFunctions'

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
	private subscriberTimer: NodeJS.Timer
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
	 * Setup a subscription to updates from the console, or renew those subscriptions. These subscriptions expire every 10 seconds, so must be renewed before then (see set interval below)
	 */
	private subscribeOSC() {
		if (this.deviceType === 'xair' || this.deviceType === 'x32') {
			this.udpPort.send({ address: '/xremote' }) // Subscribe to all changes on the device except metering
			this.udpPort.send({ address: '/meters', args: [{ type: 's', value: '/meters/1' }] }) // Subscribe to metering
		}
	}

	/**
	 * Iterate through all faders to get initial levels for them - subscribing only gets changes not the values they're currently at!
	 * We also call this when firing a preset, as that might have impacted faders, and when we make a change we're not notified by the device
	 */
	private manuallyGetFaderPositions() {
		FaderRepository.getAll().then((faders: DatabaseFader[]) => {
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
				this.datastoreUpdated()
				this.setCheckStatusCycle(5000) // Turn the frequency right down, we don't need to spam it constantly
			}
		} else if (currentMillis - this.lastOSCMessage < 500 && !this.datastore.status) {
			// We're not connected but we have heard recently, so we need to setup the connection again
			this.udpPort.send({ address: '/info', args: [] })
			this.datastore.status = true
			this.setCheckStatusCycle(250) // Turn the frequency back up to maintain a connection
			this.subscribeOSC()
			this.manuallyGetFaderPositions()
			this.datastoreUpdated()
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
	private datastoreUpdated() {
		const data = this.datastore
		broadcast('oscDatastoreUpdate', data)
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
		this.udpPort = new oscHandler.UDPPort({
			localAddress: '0.0.0.0',
			localPort: 0,
			remotePort: this.oscPort,
			remoteAddress: this.consoleAddress,
		})

		this.udpPort.on('ready', () => {
			logger.log('info', '[OSC] UDP Socket open and listening')
			this.setCheckStatusCycle(250)
			this.subscriberTimer = setInterval(() => {
				this.subscribeOSC()
			}, 9000)
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
				this.datastore.faderValues[faderStringBackToString(oscMessage.address, this.deviceType)] =
					oscMessage.args[0]
			} else if (oscMessage.address.endsWith('/mix/on') && oscMessage.args.length === 1) {
				this.datastore.faderMutes[faderStringBackToString(oscMessage.address, this.deviceType)] =
					oscMessage.args[0] === 1
			} else {
				logger.debug('[OSC] Received unrecognised message', { oscMessage })
			}
			this.datastoreUpdated()
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
		clearInterval(this.subscriberTimer)
		logger.info('Terminating UPD Port for OSC')
	}

	/**
	 * Send the value of a fader, to be set on the device
	 * @param faderString	- string of the fader to set the value of (e.g. /ch/1/mix/fader)
	 * @param value - a value between 0 and 1
	 */
	public sendFaderValue(faderString: string, value: number) {
		this.udpPort.send({ address: faderString, args: [{ type: 'f', value: [value] }] })
		this.datastore.faderValues[faderStringBackToString(faderString, this.deviceType)] = value
		this.datastoreUpdated()
	}

	/**
	 * Preset sending handler
	 * @param presetData - a SINGLE OSCFormValue Preset command or a string address to send
	 */
	public sendPreset(presetData: OSCFormValue | string) {
		if (typeof presetData === 'string') {
			this.udpPort.send({ address: presetData, args: [] })
		} else {
			const address =
				presetData.command1 +
				(presetData.value1 ?? String(presetData.value1).padStart(2, '0')) +
				presetData.command2
			let args = {}
			if (Number.isInteger(Number(presetData.value2))) {
				//assuming we have an integer so need an integer type
				args = { type: 'i', value: presetData.value2 }
			} else {
				//we have a decimal number so need a floating point type
				args = { type: 'f', value: presetData.value2 }
			}

			//Actual sending
			logger.verbose('Sending OSC Packet to address from Preset ' + address, { args })
			this.udpPort.send({ address: address, args: args })
			this.manuallyGetFaderPositions() //get the fader positions after a preset is sent, as they might have moved
		}
	}
}
