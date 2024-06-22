import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Provider } from 'react-redux'
import './app.css'
import store, { useAppDispatch } from './apis/redux/mainStore'
import Router from './router'
import { getDatabaseFromAPI, setFromNode } from './apis/redux/databaseSlice'
import { getOSCFromAPI, updateOSCDatastore } from './apis/redux/oscDataSlice'
import { Database } from './../api/database'
import { runningInElectron } from './apis/utilities/version'
import { ModalsProvider } from '@mantine/modals'
import { ScreenSaver } from './Components/ScreenSaver'
import { ConnectionLost } from './Components/ConnectionLost'
import { setSocketClients } from './apis/redux/statusSlice'
import { E131SamplingModeStatusScreen } from './Components/E131SamplingModeStatusScreen'
import { setFromAPI } from './apis/redux/e131SamplingModeSlice'
import { appendLogline } from './apis/redux/logsSlice'
import { NotificationsProvider } from '@mantine/notifications'
import { OSCDatastore } from './../output/osc'
import ErrorBoundary from './Components/ErrorBoundary'
import { Images } from './../api/images'
import { getImageDatastoreFromAPI, refreshImagesDatastore } from './apis/redux/imagesSlice'

const container = document.getElementById('app')
const root = createRoot(container)
const App = () => {
	/**
	 * Initialize the database from node
	 */
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(getDatabaseFromAPI())
		dispatch(getOSCFromAPI())
		dispatch(getImageDatastoreFromAPI())
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
			<ErrorBoundary>
				<NotificationsProvider position="top-right" limit={10}>
					<ModalsProvider>
						<ScreenSaver>
							<ConnectionLost>
								<E131SamplingModeStatusScreen>
									<Router />
								</E131SamplingModeStatusScreen>
							</ConnectionLost>
						</ScreenSaver>
					</ModalsProvider>
				</NotificationsProvider>
			</ErrorBoundary>
		</MantineProvider>
	)
}
// Strict mode disabled - see https://github.com/atlassian/react-beautiful-dnd/issues/2399
root.render(
	<Provider store={store}>
		<App />
	</Provider>
)