/* eslint-disable @typescript-eslint/no-explicit-any */
import oscHandler from 'osc'
import { broadcast } from './../../api/broadcast'
import { DatabaseFader, FaderRepository } from '../../database/repository/fader'
import meterFunctions from './meterFunctions'

/**
 * OSC Controller class
 * Cannot be called directly - create a child class for each device type (see devices subdirectory)
 */
export default abstract class OSC {
	private udpPort: any
	private lastOSCMessage: number
	private udpStatus: boolean
	private consoleAddress: string
	private oscPort: number //osc port of device
	private masterOscString: string //master fader osc string - this is how you access that master fader from the console

	/**
	 * Create a new osc object, and setup connection
	 * @param address - ip address of console
	 * @param port - osc port of console
	 * @param master - string address of master fader of the console (eg "/lr" for xair)
	 */
	constructor(address: string, port: number, master: string) {
		this.consoleAddress = address
		this.oscPort = port
		this.masterOscString = master
		this.setupOSC()
	}

	/**
	 * Send required addresses to get basic info about the device
	 */
	private subscribeOSC() {
		this.udpPort.send({ address: '/xremote' })
		this.udpPort.send({ address: '/meters', args: [{ type: 's', value: '/meters/1' }] })
	}

	/**
	 * Check we're actually connected, and try to reconnect if not
	 */
	private checkStatusOSC(): void {
		const currentMillis = +new Date()
		if (currentMillis - this.lastOSCMessage > 3000) {
			// Now disconnected from the Device
			this.setUDPStatus(false)
			this.udpPort.send({ address: '/status', args: [] }) // Keep trying anyway, no harm
		} else if (currentMillis - this.lastOSCMessage > 500 && this.udpStatus) {
			// Send a status request to hope you get something back - before you decide you're offline
			this.udpPort.send({ address: '/status', args: [] })
		} else if (currentMillis - this.lastOSCMessage < 500 && !this.udpStatus) {
			// Reconnected
			this.udpPort.send({ address: '/info', args: [] })
			this.setUDPStatus(true)
			this.subscribeOSC()
			// When a connection is first opened, want to get the statuses of stuff we're interested in
			setTimeout(async () => {
				// Timeout is to give the window the chance to have launched, so it doesn't miss the data!
				await FaderRepository.getAll().then((faders: DatabaseFader[]) => {
					// TODO what's actually happening here sorry?
					faders.forEach(entry => {
						this.udpPort.send({
							address: '/ch/' + String(entry.channel).padStart(2, '0') + '/mix/fader',
							args: [],
						})
						this.udpPort.send({
							address: '/ch/' + String(entry.channel).padStart(2, '0') + '/mix/on',
							args: [],
						})
					})
					this.udpPort.send({ address: this.masterOscString + '/mix/fader', args: [] })
					this.udpPort.send({ address: this.masterOscString + '/mix/on', args: [] })
				})
			}, 3000)
		} else if (this.udpStatus) {
			this.setUDPStatus(true)
		}
	}

	/**
	 * Set the status of the connection to the device
	 * @param status - true if connected, false if not
	 */
	private setUDPStatus(status: boolean) {
		this.udpStatus = status
		broadcast('oscMessage', { status })
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
		})

		this.udpPort.on('message', (oscMessage: { address: string; parsed: any; args: any[] }) => {
			this.lastOSCMessage = +new Date()
			this.checkStatusOSC()

			if (oscMessage.address == '/meters/1') {
				oscMessage.parsed = meterFunctions.meter1PacketParser(oscMessage.args[0])
			}
			broadcast('oscMessage', { oscMessage })
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
	private terminate() {
		this.udpPort.close()
		logger.info('Terminating UPD Port for OSC')
	}

	/**
	 * Main sending handler
	 * @param address - OSC address
	 * @param args - OSC arguments
	 */
	public send(address: string, args: any) {
		logger.verbose('Sending OSC Packet to address ' + address, { args })
		this.udpPort.send({ address: address, args: args })
	}
}
