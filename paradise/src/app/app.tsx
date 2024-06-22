import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ConnectionLost } from './Components/ConnectionLost'
import { E131SamplingModeStatusScreen } from './Components/E131SamplingModeStatusScreen'
import ErrorBoundary from './Components/ErrorBoundary'
import { ScreenSaver } from './Components/ScreenSaver'
import { getDatabaseFromAPI } from './apis/redux/databaseSlice'
import { getImageDatastoreFromAPI } from './apis/redux/imagesSlice'
import store, { useAppDispatch } from './apis/redux/mainStore'
import { getOSCFromAPI } from './apis/redux/oscDataSlice'
import './app.css'
import Router from './router'

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
