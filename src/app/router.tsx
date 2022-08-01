import React, { ReactElement } from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AppShell, Container } from '@mantine/core'
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

const Router = () => {
	return (
		<HashRouter>
			<Routes>
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
				<Route path="e131sampler" element={<div>Sampling E1.31</div>} />
				<Route path="admin" element={<MainNav navigation={<AdminNavigation />} />}>
					<Route path="configuration" element={<ConfigurationPage />} />
					<Route path="folders" element={<FoldersConfigurationPage />} />
					<Route path="presets" element={<PresetsConfigurationPage />} />
					<Route path="faders" element={<FadersConfigurationPage />} />
					<Route path="controls" element={<ControlsConfigurationPage />} />
				</Route>
				<Route path="*" element={<LandingPage />} />
			</Routes>
		</HashRouter>
	)
}
const MainNav = ({ navigation }: { navigation: ReactElement }) => {
	return (
		<AppShell navbar={navigation} padding={0}>
			<Container fluid px={'md'} py="md">
				<Outlet />
			</Container>
		</AppShell>
	)
}
export default Router
