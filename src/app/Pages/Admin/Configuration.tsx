import { Tabs } from '@mantine/core'
import React from 'react'
import { FaDrum } from '@react-icons/all-files/fa/FaDrum'
import { FaLightbulb } from '@react-icons/all-files/fa/FaLightbulb'
import { FaDatabase } from '@react-icons/all-files/fa/FaDatabase'
import { FaTools } from '@react-icons/all-files/fa/FaTools'
import { E131ModuleConfigurationPage } from './ModuleConfiguration/E131'
import { GeneralConfigurationPage } from './ModuleConfiguration/General'
import { DatabaseConfigurationPage } from './ModuleConfiguration/Database'
import { OSCModuleConfigurationPage } from './ModuleConfiguration/OSC'

export const ConfigurationPage = () => {
	return (
		<>
			<Tabs grow>
				<Tabs.Tab label="General" icon={<FaTools />}>
					<GeneralConfigurationPage />
				</Tabs.Tab>
				<Tabs.Tab label="Database" icon={<FaDatabase />}>
					<DatabaseConfigurationPage />
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
