import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Provider } from 'react-redux'
import './app.css'
import store, { useAppDispatch } from './apis/redux/mainStore'
import Router from './router'
import { getFromAPI, setFromNode } from './apis/redux/databaseSlice'
import { Database } from './../api/database'
import { runningInElectron } from './apis/utilities/version'
import { ModalsProvider } from '@mantine/modals'
import { ScreenSaver } from './Components/ScreenSaver'
import { ConnectionLost } from './Components/ConnectionLost'

const container = document.getElementById('app')
const root = createRoot(container)
const App = () => {
	/**
	 * Initialize the database from node
	 */
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(getFromAPI())
	}, [dispatch])

	return (
		<MantineProvider
			theme={{
				// Override any other properties from default theme
				colorScheme: 'dark',
				primaryColor: 'pink',
			}}
			withGlobalStyles
		>
			<ModalsProvider>
				<ScreenSaver>
					<ConnectionLost>
						<Router />
					</ConnectionLost>
				</ScreenSaver>
			</ModalsProvider>
		</MantineProvider>
	)
}
// Strict mode disabled - see https://github.com/atlassian/react-beautiful-dnd/issues/2399
root.render(
	<Provider store={store}>
		<App />
	</Provider>
)

if (runningInElectron()) {
	window.ipcApi.receive('refreshDatabase', (data: Database) => {
		store.dispatch(setFromNode(data))
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	window.ipcApi.receive('logging', (logLine: { [key: string]: any }) => {
		console.log(logLine)
	})
}
