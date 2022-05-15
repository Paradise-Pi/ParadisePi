import React, { ReactElement } from 'react'
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AppShell, Container, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { LightingPage } from './Pages/ControlPanel/Lighting'
import { AboutPage } from './Pages/ControlPanel/About'
import { HelpPage } from './Pages/ControlPanel/Help'
import { ControlPanelNavigation } from './Navigation/ControlPanelNavigation'
import { AdminNavigation } from './Navigation/AdminNavigation'
import { LandingPage } from './Pages/Landing'
import { ConfigurationPage } from './Pages/Admin/Configuration'
import { MenusConfigurationPage } from './Pages/Admin/Menus'
import { FoldersConfigurationPage } from './Pages/Admin/Folders'
import { PresetsConfigurationPage } from './Pages/Admin/Presets'
import { FadersConfigurationPage } from './Pages/Admin/Faders'
import { SortingConfigurationPage } from './Pages/Admin/Sorting'
import { ControlsConfigurationPage } from './Pages/Admin/Controls'

function Router() {
	return (
		<HashRouter>
			<Routes>
				<Route
					path="controlPanel"
					element={
						<MainNav navigation={<ControlPanelNavigation />} />
					}
				>
					<Route path="projector" element={<div>Proj</div>} />
					<Route path="sound" element={<div>Sound</div>} />
					<Route path="lighting" element={<LightingPage />} />
					<Route path="help" element={<HelpPage />} />
					<Route path="about" element={<AboutPage />} />
				</Route>
				<Route path="e131sampler" element={<div>Sampling e131</div>} />
				<Route
					path="admin"
					element={<MainNav navigation={<AdminNavigation />} />}
				>
					<Route
						path="configuration"
						element={<ConfigurationPage />}
					/>
					<Route path="menus" element={<MenusConfigurationPage />} />
					<Route
						path="folders"
						element={<FoldersConfigurationPage />}
					/>
					<Route
						path="presets"
						element={<PresetsConfigurationPage />}
					/>
					<Route
						path="faders"
						element={<FadersConfigurationPage />}
					/>
					<Route
						path="sorting"
						element={<SortingConfigurationPage />}
					/>
					<Route
						path="controls"
						element={<ControlsConfigurationPage />}
					/>
				</Route>
				<Route path="*" element={<LandingPage />} />
			</Routes>
		</HashRouter>
	)
}
const MainNav = ({ navigation }: { navigation: ReactElement }) => {
	const { height } = useViewportSize()
	return (
		<AppShell navbar={navigation} padding={0}>
			<ScrollArea
				style={{ height }}
				type="auto"
				offsetScrollbars
				scrollbarSize={20}
			>
				<Container fluid px={'md'} py="md">
					<Outlet />
				</Container>
			</ScrollArea>
		</AppShell>
	)
}
export default Router
