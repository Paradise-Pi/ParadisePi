import { Tabs } from '@mantine/core'
import React from 'react'
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
					<GeneralConfigurationPage />
				</Tabs.Panel>
				<Tabs.Panel value="Screensaver" pt="xs">
					<ScreensaverConfigurationPage />
				</Tabs.Panel>
				<Tabs.Panel value="Logs" pt="xs">
					<DatabaseAndLogsConfigurationPage />
				</Tabs.Panel>
				<Tabs.Panel value="sACN" pt="xs">
					<E131ModuleConfigurationPage />
				</Tabs.Panel>
				<Tabs.Panel value="OSC" pt="xs">
					<OSCModuleConfigurationPage />
				</Tabs.Panel>
			</Tabs>
		</>
	)
}
