import { AppShell, Container, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import React, { ReactElement } from 'react'
import { Outlet, Route, RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom'
import { AdminPin } from './Components/Admin/AdminPin'
import { Locked } from './Components/Locked'
import { AdminNavigation } from './Navigation/AdminNavigation'
import { ControlPanelNavigation } from './Navigation/ControlPanelNavigation'
import { ConfigurationPage } from './Pages/Admin/Configuration'
import { ControlsConfigurationPage } from './Pages/Admin/Controls'
import { FadersConfigurationPage } from './Pages/Admin/Faders'
import { FoldersConfigurationPage } from './Pages/Admin/Folders'
import { PresetsConfigurationPage } from './Pages/Admin/Presets'
import { TimeClockTriggersConfigurationPage } from './Pages/Admin/TimeClockTriggers'
import { ChannelCheckPage } from './Pages/ControlPanel/E131/ChannelCheck'
import { KeypadPage } from './Pages/ControlPanel/E131/Keypad'
import { HelpPage } from './Pages/ControlPanel/Help'
import { PresetPage } from './Pages/ControlPanel/Preset'
import { LandingPage } from './Pages/Landing'

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
