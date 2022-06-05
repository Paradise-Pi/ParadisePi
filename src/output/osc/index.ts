/* eslint-disable @typescript-eslint/no-explicit-any */
import oscHandler from 'osc'
import { DatabaseFader, FaderRepository } from '../../database/repository/fader'
import meterFunctions from './meterFunctions'

interface mixerConfig {
	[key: string]: any
}

//This class cannot be called directly, create a child osc class for each console
export default abstract class osc {
	private udpPort: any
	private lastOSCMessage: number
	private udpStatus: boolean
	private consoleAddress: string

	//mixer config
	//osc port of
	private oscPort: number
	//master fader osc string
	private masterOscString: string

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
	 * Send required addresses to get basic info about the mixer
	 */
	private subscribeOSC() {
		this.udpPort.send({ address: '/xremote' })
		this.udpPort.send({ address: '/meters', args: [{ type: 's', value: '/meters/1' }] })
	}

	/**
	 * Check we're actually connected, and try to reconnect if not
	 */
	private checkStatusOSC() {
		const currentMillis = +new Date()
		if (currentMillis - this.lastOSCMessage > 3000) {
			// Now disconnected from the Mixer
			this.udpStatus = false
			try {
				//TODO: Convert this ->mainWindow.webContents.send('OSCStatus', false)
			} catch (err) {
				// Ignore, it's normally because electron has quit but you're still tidying up
			}
			this.udpPort.send({ address: '/status', args: [] }) // Keep trying anyway, no harm
		} else if (currentMillis - this.lastOSCMessage > 500 && this.udpStatus) {
			// Send a status request to hope you get something back - before you decide you're offline
			this.udpPort.send({ address: '/status', args: [] })
		} else if (currentMillis - this.lastOSCMessage < 500 && !this.udpStatus) {
			// Reconnected
			this.udpStatus = true
			this.udpPort.send({ address: '/info', args: [] })
			try {
				//TODO: Convert this ->mainWindow.webContents.send('OSCStatus', true)
			} catch (err) {
				// Ignore, it's normally because electron has quit but you're still tidying up
			}
			this.subscribeOSC()
			// When a connection is first opened, want to get the statuses of stuff we're interested in
			setTimeout(async () => {
				// Timeout is to give the window the chance to have launched, so it doesn't miss the data!
				await FaderRepository.getAll().then((faders: DatabaseFader[]) => {
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
			// Still connected, just tell the frontend anyway because it's occasionally dozy (mostly on boot tbh)
			try {
				//TODO: Convert this -> mainWindow.webContents.send('OSCStatus', true)
			} catch (err) {
				// Ignore, it's normally because electron has quit but you're still tidying up
			}
		}
	}

	/**
	 * Setup actual osc handling
	 */
	private setupOSC() {
		this.udpPort = new oscHandler.UDPPort({
			localAddress: '0.0.0.0',
			localPort: 57121,
			remotePort: this.oscPort,
			remoteAddress: this.consoleAddress,
		})

		this.udpPort.on('ready', function () {
			logger.log('info', '[OSC] UDP Socket open and listening')
		})

		this.udpPort.on('message', function (oscMessage: { address: string; parsed: any; args: any[] }) {
			this.lastOSCMessage = +new Date()
			this.checkStatusOSC()

			if (oscMessage.address == '/meters/1') {
				oscMessage.parsed = meterFunctions.meter1PacketParser(oscMessage.args[0])
			}
			try {
				//TODO: Convert this ->mainWindow.webContents.send('fromOSC', oscMessage)
			} catch (err) {
				// Ignore, it's normally because electron has quit but you're still tidying up
			}
		})
		this.udpPort.on('error', function (err: any) {
			logger.log('error', err)
		})

		//actually open the content
		this.udpPort.open()
	}

	/**
	 * Main sending handler
	 * @param address OSC address
	 * @param args OSC arguments
	 */
	public send(address: string, args: any) {
		logger.verbose('args', args)
		this.udpPort.send({ address: address, args: args })
	}
}
