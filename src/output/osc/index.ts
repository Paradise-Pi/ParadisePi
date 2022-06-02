/* eslint-disable @typescript-eslint/no-explicit-any */
import oscHandler from 'osc'
import { ConfigRepository } from '../../database/repository/config'
import { DatabaseFader, FaderRepository } from '../../database/repository/fader'
import meterFunctions from './meterFunctions'

interface mixerConfig {
	[key: string]: any
}

export default class osc {
	private udpPort: any
	private lastOSCMessage: number
	private udpStatus: boolean
	private consoleAddress: string

	//mixer config
	//osc port of 
	private static oscPort: number
	//master fader osc string
	private static masterOscString: string

	constructor(port:number, master:string) {
		this.consoleAddress = ConfigRepository.getItem('oscAddress')
		this.oscPort = port
		this.masterOscString = master
	}

	/**
	 * Send required addresses to get basic info about the mixer
	 */
	subscribeOSC() {
		this.udpPort.send({ address: '/xremote' })
		this.udpPort.send({ address: '/meters', args: [{ type: 's', value: '/meters/1' }] })
	}

	/**
	 * Check we're actually connected, and try to reconnect if not
	 */
	checkStatusOSC() {
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
	setupOSC() {
		this.udpPort = new oscHandler.UDPPort({
			localAddress: '0.0.0.0',
			localPort: 57121,
			remotePort: this.oscPort,
			remoteAddress: this.consoleAddress,
		})

		this.udpPort.on('ready', function () {
			console.log('UDP Socket open and listening')
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
			console.log(err)
		})
		//actually open the content
		this.udpPort.open()
	}

	/**
	 * Main sending handler
	 * @param address OSC address
	 * @param args OSC arguments
	 */
	send(address: string, args: any) {
		this.udpPort.send({ address: address, args: args })
	}
}
