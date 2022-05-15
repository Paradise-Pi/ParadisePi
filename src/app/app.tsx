import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Provider } from 'react-redux'
import './app.css'
import store, { useAppDispatch } from './Apis/mainStore'
import Router from './router'
import { getFromAPI, setFromNode } from './Apis/databaseSlice'
import { Database } from '../api/database'
import { runningInElectron } from './Apis/version'
import { ModalsProvider } from '@mantine/modals'

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
				<Router />
			</ModalsProvider>
		</MantineProvider>
	)
}
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
)

if (runningInElectron()) {
	window.ipcApi.receive('refreshDatabase', (data: Database) => {
		store.dispatch(setFromNode(data))
	})
}
