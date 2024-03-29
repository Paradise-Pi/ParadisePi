import staticServer from 'node-static'
import http from 'http'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import dataSource from './../database/dataSource'
import { reboot } from './../electron/windowUtilities'
import path from 'path'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './../api/socketIo'
import { routeRequest } from './../api/router'
import { Server } from 'socket.io'
import { broadcast } from './../api/broadcast'
import { getAvailablePort } from './availablePorts'
import { createDatabaseObject, Database, sendDatabaseObject } from './../api/database'
import { ConfigRepository } from './../database/repository/config'
import { createAndSendImagesObject } from './../api/images'
import { PresetRepository } from './../database/repository/preset'
import { Preset } from './../database/model/Preset'
/**
 * The webserver is responsible for serving requests from other devices on the network that might want to connect.
 * This includes devices such as iPads who want to use the remote interface, a web browser which wants to
 */
export class WebServer {
	static staticFileServer: staticServer.Server
	static server: http.Server
	static socketIo: Server
	static socketIoClients: {
		[key: string]: {
			os: string
			ip: string
		}
	}
	constructor() {
		WebServer.staticFileServer = new staticServer.Server(__dirname + '/../renderer/', {
			cache: false,
			indexFile: 'main_window/index.html',
			headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
		})
		WebServer.server = http.createServer((req, res) => {
			if (req.url == '/database/upload' && req.method.toLowerCase() === 'post') {
				res.writeHead(200, { 'Content-Type': 'text/html' })
				// Allow uploading of the database
				const form = new IncomingForm({
					filename: () => 'user-uploaded-database.sqlite',
					uploadDir: path.join(__dirname, '../../'),
					maxFiles: 1,
					allowEmptyFiles: false,
				})
				form.parse(req, err => {
					if (err || !fs.existsSync(path.join(__dirname, '../../user-uploaded-database.sqlite'))) {
						if (err) {
							res.write(err)
							logger.error(err)
						}
						res.write(
							'<br/>Error encountered - not continuing with upload, so system is still running. <a href="/">Click here to return to administration</a>'
						)
						res.end()
					} else {
						dataSource.destroy().then(() => {
							fs.rename(
								path.join(__dirname, '../../user-uploaded-database.sqlite'),
								path.join(__dirname, '../../database.sqlite'),
								err => {
									if (err) {
										res.write(err)
										logger.error(err)
										res.write(
											'<br/>Error encountered - upload failed & system crashed. Please re-install Paradise'
										)
									} else {
										res.write(
											'System restored from backup. Please wait for the device to reboot and apply the new configuration <meta http-equiv="refresh" content="30;url=/" />'
										)
									}
									res.end()
									reboot(true)
								}
							)
						})
					}
				})
			} else if (req.url == '/database/download') {
				// Allow backup of database
				dataSource.destroy().then(() => {
					const filePath = path.join(__dirname, '../../database.sqlite')
					const fileStat = fs.statSync(filePath)
					const fileRead = fs.readFileSync(filePath)
					dataSource.initialize().then(() => {
						res.writeHead(200, {
							'Content-Type': 'application/octet-stream',
							'Content-Disposition': `attachment;filename="ParadisePi-${Date.now()}.sqlite"`,
							'Content-Length': fileStat.size,
						})
						res.write(fileRead)
						dataSource
						res.end()
					})
				})
			} else if (req.url == '/logs') {
				// Allow  downloading of logs
				const filePath = path.join(__dirname, '../../logs/log.log')
				const fileStat = fs.statSync(filePath)
				const fileRead = fs.readFileSync(filePath)
				res.writeHead(200, {
					'Content-Type': 'application/octet-stream',
					'Content-Disposition': `attachment;filename="paradiselogs-${Date.now()}.txt"`,
					'Content-Length': fileStat.size,
				})
				res.write(fileRead)
				res.end()
			} else if (req.url == '/logo/upload' && req.method.toLowerCase() === 'post') {
				// Allow uploading of logo
				logger.verbose('Incoming logo upload')
				new IncomingForm({
					filename: (_name, ext) => 'logo' + ext,
					keepExtensions: true,
					uploadDir: path.join(__dirname, '../../'),
					maxFiles: 1,
					maxFileSize: 2 * 1024 * 1024, // 2MB
					allowEmptyFiles: false,
					filter: ({ mimetype }) => {
						return mimetype && mimetype.includes('image') // Only allow images
					},
				}).parse(req, (err, fields, files) => {
					if (
						err ||
						!files.logo ||
						!Array.isArray(files.logo) ||
						files.logo.length !== 1 ||
						!files.logo[0].newFilename
					) {
						res.writeHead(500, { 'Content-Type': 'text/html' })
						if (err) {
							res.write(err)
							logger.error(err)
						}
						res.write(
							'<br/>Error encountered - not continuing with upload. <a href="/">Click here to return to administration</a>'
						)
						res.end()
					} else {
						ConfigRepository.save({
							key: 'logoPath',
							value: files.logo[0].newFilename,
						})
							.then(() => {
								logger.verbose('Incoming logo upload saved')
								createAndSendImagesObject()
							})
							.then(() => {
								res.writeHead(302, { Location: req.headers.referer })
								res.end()
							})
					}
				})
			} else if (req.url.startsWith('/trigger')) {
				if (req.url.startsWith('/trigger/preset/')) {
					// This allows external clients to make HTTP requests to trigger presets
					const presetId = parseInt(req.url.split('/').pop())
					if (isNaN(presetId)) {
						res.writeHead(400, { 'Content-Type': 'text/html' })
						res.write('Preset ID not found')
						res.end()
					} else {
						PresetRepository.findOneOrFail({ where: { id: presetId } })
							.then((value: Preset) => {
								if (value.httpTriggerEnabled) {
									routeRequest('/presets/recall/' + presetId, 'GET', {})
										.then(() => {
											res.writeHead(200, { 'Content-Type': 'text/html' })
											res.write('Preset triggered')
											res.end()
										})
										.catch(() => {
											res.writeHead(500, { 'Content-Type': 'text/html' })
											res.write('Error - preset could not be recalled')
											res.end()
										})
								} else {
									res.writeHead(403, { 'Content-Type': 'text/html' })
									res.write('Preset not enabled for trigger via HTTP')
									res.end()
								}
							})
							.catch(() => {
								res.writeHead(404, { 'Content-Type': 'text/html' })
								res.write('Error - preset not found')
								res.end()
							})
					}
				} else {
					res.writeHead(404, { 'Content-Type': 'text/html' })
					res.write('Not found')
					res.end()
				}
			} else {
				// Serve the react app
				WebServer.staticFileServer.serve(req, res, (e: Error) => {
					if (e) {
						if (e.message == 'Not Found') {
							WebServer.staticFileServer.serveFile(
								// 404 Page
								'/main_window/index.html',
								200,
								{},
								req,
								res
							)
						} else {
							// 500 Page
							res.writeHead(500, { 'Content-Type': 'text/html' })
							res.write(e.message)
							res.end()
						}
					}
				})
			}
		})
		// Setup CORS for Webserver
		WebServer.socketIo = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
			WebServer.server,
			{
				cors: {
					origin: '*',
				},
			}
		)
		// Start the webserver and handle requests
		getAvailablePort().then(port => {
			globalThis.port = port
			WebServer.server.listen(port)
			WebServer.socketIoClients = {}
			WebServer.socketIo.use((socket, next) => {
				const userPassword = socket.handshake.auth.password
				ConfigRepository.getItem('remotePassword').then(password => {
					if (password === null || password === '' || userPassword === password) {
						next()
					} else {
						next(new Error('Password incorrect'))
					}
				})
			})
			WebServer.socketIo.on('connection', socket => {
				const os = socket.handshake.query ? (socket.handshake.query.os as string) : 'unknown'
				WebServer.socketIoClients[socket.id] = {
					os,
					ip: socket.conn.remoteAddress,
				}
				broadcast('socketClients', WebServer.socketIoClients)

				// This allows the frontend to make requests to the api via socket.io, using the same router as the IPC
				socket.on('apiCall', (path, method, payload, callback) => {
					routeRequest(path, method, payload)
						.then(response => {
							callback(true, response, null)
						})
						.catch(error => {
							callback(false, {}, error.message)
						})
				})
				socket.on('disconnect', () => {
					delete WebServer.socketIoClients[socket.id]
					broadcast('socketClients', WebServer.socketIoClients)
				})
			})
			logger.info('Web & Socket server running port ' + port)
			createDatabaseObject('Webserver running').then((response: Database) => {
				sendDatabaseObject(response)
			})
		})
	}
}
