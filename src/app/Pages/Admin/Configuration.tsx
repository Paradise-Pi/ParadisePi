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
			<Tabs grow>
				<Tabs.Tab label="General" icon={<FaTools />}>
					<GeneralConfigurationPage />
				</Tabs.Tab>
				<Tabs.Tab label="Screensaver" icon={<FaPaintBrush />}>
					<ScreensaverConfigurationPage />
				</Tabs.Tab>
				<Tabs.Tab label="Database & Logs" icon={<FaDatabase />}>
					<DatabaseAndLogsConfigurationPage />
				</Tabs.Tab>
				<Tabs.Tab label="sACN (E1.31)" icon={<FaLightbulb />}>
					<E131ModuleConfigurationPage />
				</Tabs.Tab>
				<Tabs.Tab label="OSC" icon={<FaDrum />}>
					<OSCModuleConfigurationPage />
				</Tabs.Tab>
			</Tabs>
		</>
	)
}
