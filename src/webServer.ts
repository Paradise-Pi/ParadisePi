import staticServer from 'node-static'
import http from 'http'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import dataSource from './database/dataSource'
import { reboot } from './electron/windowUtilities'
import path from 'path'
import {
	ClientToServerEvents,
	InterServerEvents,
	ServerToClientEvents,
	SocketData,
} from './api/socketIo'
import { routeRequest } from './api/router'
import { Server } from 'socket.io'

export class WebServer {
	static staticFileServer: staticServer.Server
	static server: http.Server
	static socketIo: Server
	constructor() {
		WebServer.staticFileServer = new staticServer.Server(
			__dirname + '/../renderer/',
			{
				cache: false,
				indexFile: 'main_window/index.html',
			}
		)
		WebServer.server = http.createServer(function (req, res) {
			if (req.url == '/database/upload') {
				// Allow uploading of the database
				const form = new IncomingForm({
					filename: () => 'user-uploaded-database.sqlite',
					uploadDir: path.join(__dirname, '../../'),
					maxFiles: 1,
				})
				form.parse(req, function (err) {
					if (err) throw err
					dataSource.destroy().then(() => {
						fs.rename(
							'user-uploaded-database.sqlite',
							'database.sqlite',
							err => {
								if (err) throw err
								res.write(
									'System restored from backup. Please now check the device has initiated correctly'
								)
								res.end()
								reboot(true)
							}
						)
					})
				})
			} else if (req.url == '/database/download') {
				// Allow backup of database
				const filePath = path.join(__dirname, '../../database.sqlite')
				const fileStat = fs.statSync(filePath)
				const fileRead = fs.readFileSync(filePath)
				res.writeHead(200, {
					'Content-Type': 'application/octet-stream',
					'Content-Disposition': `attachment;filename="ParadisePi-${Date.now()}.sqlite"`,
					'Content-Length': fileStat.size,
				})
				res.write(fileRead)
				res.end()
			} else {
				// Serve the react app
				WebServer.staticFileServer.serve(req, res, function (e: Error) {
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
		WebServer.socketIo = new Server<
			ClientToServerEvents,
			ServerToClientEvents,
			InterServerEvents,
			SocketData
		>(WebServer.server, {
			cors: {
				origin: '*',
			},
		})
		WebServer.server.listen(80)
		WebServer.socketIo.on('connection', socket => {
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
			socket.on('disconnect', (reason: string) => {
				//TODO remove - not needed
				console.log('Disconnected: ' + reason)
			})
		})
		console.log('Web & Socket server running')
	}
}
