import React, { ReactElement } from 'react'
import { Route, Outlet, createRoutesFromElements, RouterProvider, createHashRouter } from 'react-router-dom'
import { AppShell, Container, ScrollArea } from '@mantine/core'
import { PresetPage } from './Pages/ControlPanel/Preset'
import { HelpPage } from './Pages/ControlPanel/Help'
import { ControlPanelNavigation } from './Navigation/ControlPanelNavigation'
import { AdminNavigation } from './Navigation/AdminNavigation'
import { LandingPage } from './Pages/Landing'
import { ConfigurationPage } from './Pages/Admin/Configuration'
import { FoldersConfigurationPage } from './Pages/Admin/Folders'
import { PresetsConfigurationPage } from './Pages/Admin/Presets'
import { FadersConfigurationPage } from './Pages/Admin/Faders'
import { ControlsConfigurationPage } from './Pages/Admin/Controls'
import { Locked } from './Components/Locked'
import { ChannelCheckPage } from './Pages/ControlPanel/E131/ChannelCheck'
import { KeypadPage } from './Pages/ControlPanel/E131/Keypad'
import { useViewportSize } from '@mantine/hooks'
import { AdminPin } from './Components/Admin/AdminPin'
import { TimeClockTriggersConfigurationPage } from './Pages/Admin/TimeClockTriggers'

const MainNav = ({ navigation }: { navigation: ReactElement }) => {
	const { height } = useViewportSize()
	return (
		<AppShell navbar={navigation} padding={0}>
			<ScrollArea style={{ height }} type="auto" offsetScrollbars scrollbarSize={20}>
				<Container fluid py={'sm'} px={'sm'}>
					<Outlet />
				</Container>
			</ScrollArea>
		</AppShell>
	)
}

const HashRouter = createHashRouter(
	createRoutesFromElements(
		<>
			<Route
				path="controlPanel"
				element={
					<Locked>
						<MainNav navigation={<ControlPanelNavigation />} />
					</Locked>
				}
			>
				<Route path="folder/:folderId" element={<PresetPage />} />
				<Route path="help" element={<HelpPage />} />
				<Route path="e131">
					<Route path="channelCheck" element={<ChannelCheckPage />} />
					<Route path="lxkeypad" element={<KeypadPage />} />
				</Route>
			</Route>
			<Route
				path="admin"
				element={
					<AdminPin>
						<MainNav navigation={<AdminNavigation />} />
					</AdminPin>
				}
			>
				<Route path="configuration" element={<ConfigurationPage />} />
				<Route path="folders" element={<FoldersConfigurationPage />} />
				<Route path="presets" element={<PresetsConfigurationPage />} />
				<Route path="faders" element={<FadersConfigurationPage />} />
				<Route path="controls" element={<ControlsConfigurationPage />} />
				<Route path="timeClockTriggers" element={<TimeClockTriggersConfigurationPage />} />
			</Route>
			<Route path="*" element={<LandingPage />} />
		</>
	)
)
const Router = () => <RouterProvider router={HashRouter} />

export default Router
