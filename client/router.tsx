import { AppShell, Button, Container, MediaQuery, Navbar, ScrollArea } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import React, { ReactElement, useState } from 'react'
import { Outlet, Route, RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom'
import { AdminPin } from './Components/Admin/AdminPin'
import { Locked } from './Components/Locked'
import { AdminNavigation } from './Navigation/AdminNavigation'
import { ControlPanelNavigation } from './Navigation/ControlPanelNavigation'
import { useStyles } from './Navigation/Styles'
import { ConfigurationPage } from './Pages/Admin/Configuration'
import { ControlsConfigurationPage } from './Pages/Admin/Controls'
import { DevicesConfigurationPage } from './Pages/Admin/Devices'
import { FadersConfigurationPage } from './Pages/Admin/Faders'
import { FoldersConfigurationPage } from './Pages/Admin/Folders'
import { PresetsConfigurationPage } from './Pages/Admin/Presets'
import { TimeClockTriggersConfigurationPage } from './Pages/Admin/TimeClockTriggers'
import { VariablesConfigurationPage } from './Pages/Admin/Variables'
import { ChannelCheckPage } from './Pages/ControlPanel/E131/ChannelCheck'
import { KeypadPage } from './Pages/ControlPanel/E131/Keypad'
import { HelpPage } from './Pages/ControlPanel/Help'
import { PresetPage } from './Pages/ControlPanel/Preset'
import { LandingPage } from './Pages/Landing'

const MainNav = ({ navigation }: { navigation: ReactElement }) => {
	const { classes, cx } = useStyles()
	const { height } = useViewportSize()
	const [opened, setOpened] = useState(false)
	return (
		<AppShell
			navbarOffsetBreakpoint="sm"
			navbar={
				<Navbar
					height={height}
					hiddenBreakpoint="sm"
					hidden={!opened}
					width={{ sm: 200, md: 200 }}
					p="md"
					className={classes.navbar}
				>
					<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
						<Button fullWidth onClick={() => setOpened(false)} size="lg" mb="sm" variant="outline">
							Close Menu
						</Button>
					</MediaQuery>
					{navigation}
				</Navbar>
			}
			padding={0}
		>
			<ScrollArea style={{ height }} type="auto" offsetScrollbars scrollbarSize={20}>
				<Container fluid py={'sm'} px={'sm'}>
					<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
						<Button onClick={() => setOpened(true)} size="lg" mb="sm" fullWidth variant="outline">
							Open Menu
						</Button>
					</MediaQuery>
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
				<Route path="devices" element={<DevicesConfigurationPage />} />
				<Route path="faders" element={<FadersConfigurationPage />} />
				<Route path="controls" element={<ControlsConfigurationPage />} />
				<Route path="timeClockTriggers" element={<TimeClockTriggersConfigurationPage />} />
				<Route path="variables" element={<VariablesConfigurationPage />} />
			</Route>
			<Route path="*" element={<LandingPage />} />
		</>
	)
)
const Router = () => <RouterProvider router={HashRouter} />

export default Router
