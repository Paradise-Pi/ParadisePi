import { Tabs } from '@mantine/core'
import { FaDrum } from '@react-icons/all-files/fa/FaDrum'
import { FaHistory } from '@react-icons/all-files/fa/FaHistory'
import { FaLightbulb } from '@react-icons/all-files/fa/FaLightbulb'
import { FaPaintBrush } from '@react-icons/all-files/fa/FaPaintBrush'
import { FaStethoscope } from '@react-icons/all-files/fa/FaStethoscope'
import { FaTools } from '@react-icons/all-files/fa/FaTools'
import React, { ReactNode } from 'react'
import { DiagnosticsConfigurationPage } from './ModuleConfiguration/Diagnostics'
import { E131ModuleConfigurationPage } from './ModuleConfiguration/E131'
import { GeneralConfigurationPage } from './ModuleConfiguration/General'
import { HistoryConfigurationPage } from './ModuleConfiguration/History'
import { OSCModuleConfigurationPage } from './ModuleConfiguration/OSC'
import { ScreensaverConfigurationPage } from './ModuleConfiguration/Screensaver'

// Temporarily removed because it is causing double-scrollbars on the page
const ScrollAreaForConfigModule = (props: { children: ReactNode }) => <>{props.children}</>

export const ConfigurationPage = () => {
	return (
		<>
			<Tabs defaultValue="General">
				<Tabs.List grow>
					<Tabs.Tab value="General" icon={<FaTools />}>
						General
					</Tabs.Tab>
					<Tabs.Tab value="Screensaver" icon={<FaPaintBrush />}>
						Screensaver
					</Tabs.Tab>
					<Tabs.Tab value="sACN" icon={<FaLightbulb />}>
						sACN (E1.31)
					</Tabs.Tab>
					<Tabs.Tab value="OSC" icon={<FaDrum />}>
						OSC
					</Tabs.Tab>
					<Tabs.Tab value="history" icon={<FaHistory />}>
						History Recording
					</Tabs.Tab>
					<Tabs.Tab value="diagnostics" icon={<FaStethoscope />}>
						Diagnostics
					</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="General" pt="xs">
					<ScrollAreaForConfigModule>
						<GeneralConfigurationPage />
					</ScrollAreaForConfigModule>
				</Tabs.Panel>
				<Tabs.Panel value="Screensaver" pt="xs">
					<ScrollAreaForConfigModule>
						<ScreensaverConfigurationPage />
					</ScrollAreaForConfigModule>
				</Tabs.Panel>
				<Tabs.Panel value="sACN" pt="xs">
					<ScrollAreaForConfigModule>
						<E131ModuleConfigurationPage />
					</ScrollAreaForConfigModule>
				</Tabs.Panel>
				<Tabs.Panel value="OSC" pt="xs">
					<ScrollAreaForConfigModule>
						<OSCModuleConfigurationPage />
					</ScrollAreaForConfigModule>
				</Tabs.Panel>
				<Tabs.Panel value="history" pt="xs">
					<ScrollAreaForConfigModule>
						<HistoryConfigurationPage />
					</ScrollAreaForConfigModule>
				</Tabs.Panel>
				<Tabs.Panel value="diagnostics" pt="xs">
					<ScrollAreaForConfigModule>
						<DiagnosticsConfigurationPage />
					</ScrollAreaForConfigModule>
				</Tabs.Panel>
			</Tabs>
		</>
	)
}
