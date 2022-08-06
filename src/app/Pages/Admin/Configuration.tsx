import { ScrollArea, Tabs } from '@mantine/core'
import React, { ReactNode } from 'react'
import { FaDrum } from '@react-icons/all-files/fa/FaDrum'
import { FaLightbulb } from '@react-icons/all-files/fa/FaLightbulb'
import { FaDatabase } from '@react-icons/all-files/fa/FaDatabase'
import { FaTools } from '@react-icons/all-files/fa/FaTools'
import { FaPaintBrush } from '@react-icons/all-files/fa/FaPaintBrush'
import { E131ModuleConfigurationPage } from './ModuleConfiguration/E131'
import { GeneralConfigurationPage } from './ModuleConfiguration/General'
import { DatabaseAndLogsConfigurationPage } from './ModuleConfiguration/DatabaseAndLogs'
import { OSCModuleConfigurationPage } from './ModuleConfiguration/OSC'
import { ScreensaverConfigurationPage } from './ModuleConfiguration/Screensaver'
import { useViewportSize } from '@mantine/hooks'

const ScrollAreaForConfigModule = (props: { children: ReactNode }) => {
	const { height } = useViewportSize()
	return (
		<ScrollArea style={{ height: height - 80 }} type="auto" offsetScrollbars>
			{props.children}
		</ScrollArea>
	)
}

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
					<Tabs.Tab value="Logs" icon={<FaDatabase />}>
						Database & Logs
					</Tabs.Tab>
					<Tabs.Tab value="sACN" icon={<FaLightbulb />}>
						sACN (E1.31)
					</Tabs.Tab>
					<Tabs.Tab value="OSC" icon={<FaDrum />}>
						OSC
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
				<Tabs.Panel value="Logs" pt="xs">
					<ScrollAreaForConfigModule>
						<DatabaseAndLogsConfigurationPage />
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
			</Tabs>
		</>
	)
}
